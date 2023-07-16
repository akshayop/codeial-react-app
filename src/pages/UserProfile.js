import { useLocation, useParams, useNavigate } from "react-router-dom";

import styles from "../styles/settings.module.css";
import { useEffect, useState } from "react";
import { addFriend, fetchUserProfile, removeFriend } from "../api";
import { toast } from "react-toastify";
import { Loader } from "../components";
import { useAuth } from "../hooks";


const UserProfile = () => {

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [requestInProgress, setRequestInProgress] = useState(false);
    const { userId } = useParams();
 
    const location = useLocation();
    console.log(location);
    const navigate = useNavigate();
    const auth = useAuth();
    // const { user = {} } = location.state;

    useEffect(() => {

        const getUser = async () => {
            const res = await fetchUserProfile(userId);

            if(res.success) {
                setUser(res.data.user);
            }else {

                toast.error(res.message);
                return navigate('/');

            }

            setLoading(false)
        };

        getUser();
        
    }, [userId, navigate]);

    if(loading) {
        return <Loader />
    }

    const checkIfUserIsFriend = () => {
        const friends = auth.user.friends;
        // const friends = [];

        console.log(auth.user);

        console.log(friends);
        const friendIds = friends.map(friend => {
            if(friend.to_user) {
                return friend.to_user._id
            }
        });
        const index = friendIds.indexOf(userId);

        if(index !== -1) {
            return true;

        }
        return false;
    };

    const handleAddFriendClick = async () => {

        setRequestInProgress(true);

        const res = await addFriend(userId);

        if(res.success) {
            const { friendship } = res.data;

            auth.updateUserFriends(true, friendship);
            toast.success("Friend added successfully!");
        } else {
            toast.error(res.message);
        }


        setRequestInProgress(false);
    }

    const handleRemoveFriendClick = async () => {
        setRequestInProgress(true);

        const res = await removeFriend(userId);

        if(res.success) {
            const friendship = auth.user.friends.filter(friend => friend.to_user._id === userId)

            auth.updateUserFriends(false, friendship[0]);
            toast.success("Friend removed successfully!");
        } else {
            toast.error(res.message);
        }


        setRequestInProgress(false);         
    }
   
    
    return (
        <div className={styles.settings}>
            <div className={styles.imgContainer}>
                <img src="https://cdn-icons-png.flaticon.com/128/4333/4333609.png" alt="Profile Pic" />
            </div>

            <div className={styles.field}>
                <div className={styles.fieldLabel}>Email:</div>
                <div className={styles.fieldValue}>{user.email}</div>    
            </div>

            <div className={styles.field}>
                <div className={styles.fieldLabel}>Name:</div>
                <div className={styles.fieldValue}>{user.name}</div>  {/*Basically this is also a kind of ternary operator*/}    
            </div>             

            <div className={styles.btnGrp}>

                {checkIfUserIsFriend() ? (
                    <button className={`button ${styles.saveBtn}`} onClick={handleRemoveFriendClick}>
                        {requestInProgress ? "Removing friend....." : "Remove Friend"} 
                    </button>

                ) : (
                    <button className={`button ${styles.saveBtn}`} onClick={handleAddFriendClick} disabled={requestInProgress}>
                       {requestInProgress ? "Adding friend....." : "Add Friend"} 
                    </button>
                    
                )}
            </div> 
        </div>
    )
}

export default UserProfile;