import React, {useContext, useState} from 'react';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart as faSolidHeart} from '@fortawesome/free-solid-svg-icons';
import {faHeart as faRegularHeart} from '@fortawesome/free-regular-svg-icons';
import {toast} from "react-toastify";
import config from "../config";
import {AuthContext} from "../context/AuthContext.tsx";
import styles from './LikeToggle.module.css';

interface LikeToggleProps {
    id: string;
    initialLikes: number;
    initialLiked: boolean
    long: boolean
}

const LikeToggle: React.FC<LikeToggleProps> = ({
                                                   id, initialLikes, initialLiked, long
                                               }) => {
    // Get logged in user
    const {user} = useContext(AuthContext)!;
    const [isLiked, setLiked] = useState<boolean>(initialLiked); // State for like/unlike
    const [likes, setLikes] = useState<number>(initialLikes); // State for like count
    const [likeUpdating, setLikeUpdating] = useState<boolean>(false); // Prevent duplicate requests

    // Toggle like handler
    const handleToggleLike = async () => {
        if (likeUpdating) return; // Prevent multiple clicks while updating
        setLikeUpdating(true);

        if (!user) {
            console.error("No token found, user might not be logged in.");
            setLikeUpdating(false);
            toast.error("You need to be logged in to like this clock.");
            return;
        }

        try {
            if (isLiked) {
                // Unlike (send DELETE request)
                await axios.delete(`${config.backendURL}/likes/${id}`);
                setLikes((prevLikes) => prevLikes - 1); // Update likes locally
            } else {
                // Like (send POST request)
                await axios.post(`${config.backendURL}/likes/${id}`, {});
                setLikes((prevLikes) => prevLikes + 1); // Update likes locally
            }
            setLiked(!isLiked); // Toggle like status
        } catch (error) {
            console.error('Error toggling like status:', error);
        } finally {
            setLikeUpdating(false); // Reset likeUpdating state
        }
    };

    return (
        <div
            onClick={handleToggleLike}
            className={`${styles['like-toggle']} ${(likeUpdating || !user) ? styles['like-toggle-disabled'] : ''}`}
        >
            <FontAwesomeIcon
                icon={isLiked ? faSolidHeart : faRegularHeart} // Toggle icon
                className={isLiked ? styles['icon-liked'] : styles['icon-unliked']}
            />
            {likes}{long ? " like" + (likes != 1 ? "s" : "") : ""}
        </div>
    );
};

export default LikeToggle;