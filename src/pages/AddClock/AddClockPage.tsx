import React, {useCallback, useContext, useState} from 'react';
import axios from 'axios';
import {Navigate, useNavigate} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext.tsx";
import config from "../../config.ts";
import {useDropzone} from "react-dropzone";

const AddClockPage = () => {
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const {user} = useContext(AuthContext)!;
    const requiredFiles = Array.from({length: 11}, (_, i) => `${i + 1}.jpg`); // ['1.jpg', ..., '11.jpg']

    // Handle file drop
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setError(null); // Clear previous errors
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'], // Accept only .jpg files
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
            files.forEach((file) => {
                // Append the file and prefix its name with the ID (handled server-side)
                formData.append('files', file);
            });

            console.log('Uploading files:', formData);

            const uploadResponse = await axios.post(
                `${config.backendURL}/uploads`,
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
            // Validate that all required files ('1.jpg' to '11.jpg') are present
            const uploadedFileNames = files.map((file) => file.name); // Get filenames of uploaded files
            const missingFiles = requiredFiles.filter((requiredFile) => !uploadedFileNames.includes(requiredFile));

            if (missingFiles.length > 0) {
                setError(`Missing files: ${missingFiles.join(', ')}`);
                return;
            }

            // Step 1: Add the new clock
            const clockResponse = await axios.post(`${config.backendURL}/clocks`, {
                name, author
            });

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
        }
    };


    return (
        <div className="add-clock-page">
            <h2>Add New Clock</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Clock Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="author">Author Name (if not uploader)</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>
                {/*<div>*/}
                {/*    <label htmlFor="jpgUrl">JPG URL</label>*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        id="jpgUrl"*/}
                {/*        value={jpgUrl}*/}
                {/*        onChange={(e) => setJpgUrl(e.target.value)}*/}
                {/*    />*/}
                {/*</div>*/}
                <div className="drag-and-drop">
                    <label>Upload Required Images (1.jpg to 11.jpg)</label>
                    <div
                        {...getRootProps()}
                        style={{
                            border: '2px dashed #ccc',
                            padding: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            marginBottom: '10px',
                        }}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>Drop the images here...</p>
                        ) : (
                            <p>Drag and drop JPG files here, or click to select them</p>
                        )}
                    </div>
                    <div>
                        <strong>Uploaded Files:</strong>
                        <ul>
                            {files.map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
                <button type="submit">Add Clock</button>
            </form>
        </div>
    );
};

export default AddClockPage;
