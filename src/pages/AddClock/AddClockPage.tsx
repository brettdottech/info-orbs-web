import React, {useCallback, useEffect, useState} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import {useDropzone} from "react-dropzone";
import styles from './AddClockPage.module.css';
import ProgressSpinner from "../../components/ProgressSpinner.tsx";
import jpeg from 'jpeg-js';
import {isProgressiveJPEG} from "../../utils/jpeghelper.ts"
import Card from "../../components/Card.tsx";
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import {useApi} from "../../hooks/useApi.ts";

type FilePreview = {
    file: File;
    preview: string;
};

const AddClockPage = () => {
    const [form, setForm] = useState({name: '', author: '', url: '', description: '', secondHandColor: '#ffffff'});
    const [files, setFiles] = useState<FilePreview[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const {user} = useKindeAuth();
    const requiredFiles = Array.from({length: 12}, (_, i) => `${i}.jpg`); // ['0.jpg', ..., '11.jpg']
    const [showSpinner, setShowSpinner] = useState(false);
    const [showDragAndDrop, setShowDragAndDrop] = useState(true);
    const api = useApi();

    useEffect(() => {
        setShowDragAndDrop(files.length !== requiredFiles.length);
        return () => {
            files.forEach(({preview}) => URL.revokeObjectURL(preview));
        };
    }, [files]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {id, value} = e.target;
        setForm({...form, [id]: value});
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setError(null);
        const validFiles: FilePreview[] = [];
        const invalidFiles: string[] = [];

        for (const file of acceptedFiles) {
            if (!requiredFiles.includes(file.name)) {
                invalidFiles.push(`${file.name} (invalid file name)`);
                continue;
            }

            if (files.some((f) => f.file.name === file.name)) {
                invalidFiles.push(`${file.name} (duplicate file)`);
                continue;
            }

            const fileReader = new FileReader();
            const arrayBuffer = await new Promise<ArrayBuffer | null>((resolve) => {
                fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
                fileReader.onerror = () => resolve(null);
                fileReader.readAsArrayBuffer(file);
            });

            if (!arrayBuffer) {
                invalidFiles.push(`${file.name} (file reading error)`);
                continue;
            }

            try {
                jpeg.decode(new Uint8Array(arrayBuffer), {useTArray: true});
            } catch {
                invalidFiles.push(`${file.name} (invalid JPEG)`);
                continue;
            }

            const image = new Image();
            const imageSrc = URL.createObjectURL(file);
            const dimensionsValid = await new Promise<boolean>((resolve) => {
                image.onload = () => resolve(image.width === 240 && image.height === 240);
                image.onerror = () => resolve(false);
                image.src = imageSrc;
            });
            URL.revokeObjectURL(imageSrc); // Clean up the URL

            if (!dimensionsValid) {
                invalidFiles.push(`${file.name} (invalid dimensions, must be 240x240)`);
                continue;
            }

            if (isProgressiveJPEG(arrayBuffer)) {
                invalidFiles.push(`${file.name} (progressive JPEGs are not allowed)`);
                continue;
            }

            validFiles.push({file, preview: URL.createObjectURL(file)});
        }

        // Update state once after all processing is done
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
        if (invalidFiles.length) {
            setError(`Invalid files:\n${invalidFiles.join(', ')}`);
        }
    }, [files, requiredFiles]);


    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg'], // Accept only .jpg files
        },
        multiple: true, // Allow multiple file uploads
    });

    if (!user) {
        return <Navigate to="/login"/>;
    }

    const uploadFiles = async (id: string) => {
        try {
            // Upload all the files to the backend
            const formData = new FormData();
            formData.set("id", id);
            files.forEach((filePreview) => {
                // Append the file and prefix its name with the ID (handled server-side)
                formData.append('files', filePreview.file);
            });

            console.log('Uploading files:', formData);

            const uploadResponse = await api.post("/uploads",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Upload response:', uploadResponse.data);
        } catch (error) {
            console.error('Error uploading files:', error);
            throw new Error('File upload failed');
        }
    };

// This is the main function that creates a clock and uploads files
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        try {
            if (form.name.trim() === '') {
                setError('Name is required');
                return;
            }

            // Validate that all required files ('1.jpg' to '11.jpg') are present
            const uploadedFileNames = files.map((filePreview) => filePreview.file.name); // Get filenames of uploaded files
            const missingFiles = requiredFiles.filter((requiredFile) => !uploadedFileNames.includes(requiredFile));

            if (missingFiles.length > 0) {
                setError(`Missing files: ${missingFiles.join(', ')}`);
                return;
            }

            setShowSpinner(true);

            // Step 1: Add the new clock
            const clockResponse = await api.post("/clocks", form);

            const clockId = clockResponse.data.id;
            console.log('Clock created with ID:', clockId);

            // Step 2: Upload files after clock is created
            await uploadFiles(clockId);

            // Step 3: Navigate to the home page after successful upload
            navigate('/');
        } catch (error) {
            console.error('Error uploading files or adding the clock:', error);

            // Step 4: Handle errors
            setError('There was an error uploading the files or adding the clock. Please try again.');
        } finally {
            setShowSpinner(false);
        }
    };


    function removeItem(index: number) {
        setFiles(files.filter((_, i) => i !== index));
    }

    return (
        <div className="add-clock-page">
            <div className="text-xl font-bold mt-2">Add New Clock</div>
            <form onSubmit={handleSubmit}>
                <Card>
                    <div className={styles['flex-container']}>
                        <div className={styles['input-group']}>
                            <label htmlFor="name">Clock Name</label>
                            <input
                                type="text"
                                id="name"
                                value={form.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles['input-group']}>
                            <label htmlFor="author">Author Name</label>
                            <input
                                type="text"
                                id="author"
                                placeholder="Optional"
                                value={form.author}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className={styles['flex-container']}>
                        <div className={styles['input-group']}>
                            <label htmlFor="name">URL</label>
                            <input
                                type="text"
                                id="url"
                                placeholder="Optional"
                                value={form.url}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className={styles['flex-container']}>
                        <div className={styles['input-group']}>
                            <label htmlFor="desc">Description</label>
                            <textarea
                                id="description"
                                placeholder="Optional"
                                value={form.description}
                                onChange={handleInputChange}
                                className="px-2 py-1 text-lg border border-gray-300 rounded flex-1 w-full"
                            />
                        </div>
                    </div>
                    <div className={styles["input-group"]}>
                        <label htmlFor="secondHandColor">Recommended seconds color</label>
                        <input id="secondHandColor"
                               className="!p-0 !border-0 min-h-10 min-w-20 !flex-none"
                               type="color"
                               value={form.secondHandColor}
                               onChange={handleInputChange}/>
                    </div>
                </Card>
                <Card>
                    <div>
                        <label hidden={!showDragAndDrop}>
                            <div className="text-lg font-bold">Upload Required Images</div>
                            <div>0.jpg to 11.jpg, 10.jpg=no colon image, 11.jpg=colon image</div>
                        </label>
                        <div
                            {...getRootProps()}
                            className={"border-2 m-3 border-dashed border-gray-300 p-5 text-center cursor-pointer mb-2.5" + (isDragActive ? " border-blue-600" : "")}
                            hidden={!showDragAndDrop}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <p className="text-blue-600">Drop the images here...</p>
                            ) : (
                                <p>Drag and drop JPG files here, or click to select them</p>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                            {files.map((filePreview, index) => (
                                <div key={filePreview.file.name} className="flex flex-col items-center max-w-[100px]"
                                     onClick={() => removeItem(index)}>
                                    <img
                                        src={filePreview.preview}
                                        alt={filePreview.file.name}
                                        className="max-w-full max-h-[100px] border border-gray-300 rounded"
                                    />

                                    <div>{filePreview.file.name}</div>
                                </div>
                            ))}
                        </div>

                    </div>
                </Card>
                {error && <Card>
                    <div style={{color: 'red', marginTop: '10px'}} onClick={() => setError(null)}>{error}</div>
                </Card>}
                <div className="flex items-center max-w-full w-auto flex-wrap justify-end gap-4">
                    <button type="submit">Add Clock</button>
                </div>
            </form>
            <ProgressSpinner
                show={showSpinner}
                title="Uploading new Clockface"
                message="Please wait..."
            />
        </div>
    );
};

export default AddClockPage;
