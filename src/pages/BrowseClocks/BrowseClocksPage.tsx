import {useEffect, useState} from 'react';
import {Clock} from '../../types/Clock.ts';
import ClockList from "./ClockList.tsx";
import {useApi} from "../../hooks/useApi.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAdd} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../../components/Tooltip.tsx";
import {Link} from "react-router-dom";
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";

const BrowseClocksPage = () => {
    const [clocks, setClocks] = useState<Clock[]>([]);
    const [sortOption, setSortOption] = useState<string>('Downloads');
    const [showApproved, setShowApproved] = useState<boolean>(true);

    const api = useApi();
    const {isAuthenticated} = useKindeAuth();

    useEffect(() => {
        console.log('Fetching clocks...');

        api('/clocks')
            .then(response => {
                console.log('Fetched clocks:', response.data);
                setClocks(response.data)
            })
            .catch(error => console.error('Error fetching clocks:', error));
    }, [api]);

    // Handle sorting
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(event.target.value);
    };

    // Sort clocks based on selected option
    const sortedClocks = [...clocks].sort((a, b) => {
        switch (sortOption) {
            case "Newest":
                // Assuming clocks have a `createdAt` property (ISO string or timestamp)
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "Likes":
                return b.likes - a.likes; // Assuming `likes` is a number
            case "Downloads":
                return b.downloads - a.downloads; // Assuming `downloads` is a number
            case 'ClockName':
                return a.name.localeCompare(b.name);
            case 'AuthorName': {
                const authorA = a.author && a.author.length > 0 ? a.author : a.userName;
                const authorB = a.author && a.author.length > 0 ? a.author : a.userName;
                return authorA.localeCompare(authorB);
            }
            default:
                return 0;
        }
    });

    if (clocks.length === 0) {
        return <div className="flex items-center justify-center min-h-60 text-white text-xl">Loading...</div>;
    }

    const approvedClocks = sortedClocks.filter(clock => clock.approved);
    const unapprovedClocks = sortedClocks.filter(clock => !clock.approved);

    return (
        <div>
            <div className="flex items-center gap-4 mt-4 max-w-full w-auto flex-wrap justify-between">
                {(unapprovedClocks.length > 0) && (
                    <div className="flex items-center gap-4 flex-wrap">
                        <span
                            className={`text-lg font-bold whitespace-nowrap cursor-pointer ${showApproved ? 'text-blue-500' : 'text-white'}`}
                            onClick={() => setShowApproved(true)}>
                            Approved ({approvedClocks.length})
                        </span>
                        <span className="text-lg whitespace-nowrap text-white"> | </span>
                        <span
                            className={`text-lg font-bold whitespace-nowrap cursor-pointer ${!showApproved ? 'text-blue-500' : 'text-white'}`}
                            onClick={() => setShowApproved(false)}>
                            Not approved ({unapprovedClocks.length})
                        </span>
                    </div>
                )}
                <div className="flex items-center gap-4 ml-auto">
                    <label className="text-lg font-bold whitespace-nowrap" htmlFor="sort">Sort By: </label>
                    <select id="sort" value={sortOption} onChange={handleSortChange}
                            className="p-1 text-sm border border-gray-300 rounded bg-gray-700 text-white">
                        <option value="Newest">Newest</option>
                        <option value="Likes">Likes</option>
                        <option value="Downloads">Downloads</option>
                        <option value="ClockName">Clock Name</option>
                        <option value="AuthorName">Author Name</option>
                    </select>
                </div>
            </div>
            <ClockList clocks={showApproved ? approvedClocks : unapprovedClocks}/>
            {isAuthenticated && (
                <div className="flex items-center max-w-full w-auto flex-wrap justify-end m-0 p-0">
                    <Tooltip text="Add Clock">
                        <Link to="/add-clock"
                              className="bg-blue-600 hover:bg-blue-800 text-white font-bold text-4xl w-14 h-14 p-0 m-0 flex items-center justify-center rounded-full shadow-lg">
                            <FontAwesomeIcon icon={faAdd}/>
                        </Link>
                    </Tooltip>
                </div>

            )}
        </div>
    );
};

export default BrowseClocksPage;
