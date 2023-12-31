import { useContext, useEffect, useState } from "react"
import { AuthContext, PostsContext } from "../providers";
import { login as userLogin , register, editProfile, fetchUserFriends, getPosts} from "../api";
import { LOCALSTORAGE_TOKEN_KEY, getItemFromLocalStorage, removeItemFromLocalStorage, setItemInLocalStorage } from "../utils";
import jwt from "jwt-decode";

export const useAuth = () => {
    return useContext(AuthContext)
};

export const useProvideAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {

        const getUser = async () => {

            const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);

            if(userToken) {
                const user = jwt(userToken);
                const res = await fetchUserFriends();

                let friends = [];

                if(res.success) {
                   
                    friends = res.data.friends;
                   
                }

                setUser({
                    ...user,
                    friends
                });

            }

            setLoading(false);

        };

        getUser();
    }, []);

    const updateUser = async (userId, name, password, confirmPassword) => {
        const res = await editProfile(userId, name, password, confirmPassword);

        console.log('response', res);

        if( res.success ) {

            setUser(res.data.user);
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY, res.data.token ? res.data.token : null);

            return {
                success: true
            }
        }

        else {
            return {
                success: false,
                message: res.message
            }
        }
    }

    const login = async (email, password) => {

        const res = await userLogin(email, password);

        if( res.success ) {

            setUser(res.data.user);
            setItemInLocalStorage(LOCALSTORAGE_TOKEN_KEY, res.data.token ? res.data.token : null);

            

            return {
                success: true
            }
        }

        else {
            return {
                success: false,
                message: res.message
            }
        }

    };

    const signup = async (name, email, password, confirmPassword) => {
        const response = await register(name, email, password, confirmPassword);
    
        if (response.success) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
            message: response.message,
          };
        }
      };

    const logout = () => {
        setUser(null);
        removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
    };

    const updateUserFriends = (addFriend, friend) => {
        if(addFriend) {
            setUser({
                ...user,
                friends: [...user.friends, friend]
            });

            return;
        }

        const newFriends = user.friends.filter(f => f.to_user._id !== friend.to_user._id);

        setUser({
            ...user,
            friends: newFriends
        });
    };

    return {
        user,
        login,
        logout,
        loading,
        signup,
        updateUser,
        updateUserFriends
    };
};

export const usePosts = () => {
    return useContext(PostsContext);
};


export const useProvidePosts = () => {
    const [posts, setPosts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchPosts = async () =>  {
          const res = await getPosts();
          
          if(res.success) {
            setPosts(res.data.posts);
          }
    
          setLoading(false);
        }
    
        fetchPosts();
        
    }, []);

    const addPoststoState = (post) => {
        const newPosts = [post, ...posts];

    setPosts(newPosts);
    }

    const addComment = (comment, postId) => {
        const newPosts = posts.map((post) => {
          if (post._id === postId) {
            return { ...post, comments: [...post.comments, comment] };
          }
          return post;
        });
    
        setPosts(newPosts);
      };
    

    return {
        data: posts,
        loading,
        addPoststoState,
        addComment
    };

};