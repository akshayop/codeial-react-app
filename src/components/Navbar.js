import { Link } from 'react-router-dom';
import styles from '../styles/navbar.module.css'
import { useAuth } from '../hooks';
import { useEffect, useState } from 'react';
import { searchUsers } from '../api';

const Navbar = () => {

    const [results, setResults] = useState([]);
    const [searchText, setSearchText] = useState('');
    const auth = useAuth();

    useEffect( () => {

        const fetchUsers = async () => {
            const res = await searchUsers(searchText);

            if(res.success) {
                setResults(res.data.users);
            };
        };

        if(searchText.length > 2) {
            fetchUsers();
        } else {
            setResults([]);
        }
    }, [searchText]);

    const handleRemoveList = () => {
        setResults([]);
        setSearchText('');
    }

    return (
        <div className={styles.nav}>
            <div className={styles.leftDiv}>
                <Link to='/'>
                    <img alt='Logo' src='https://ninjasfiles.s3.amazonaws.com/0000000000003454.png'/>
                </Link>
            </div>

            <div className={styles.searchContainer}>
                <img className={styles.searchIcon} src='https://cdn-icons-png.flaticon.com/128/54/54481.png' alt='' />
                <input placeholder='Search users' value={searchText} onChange={(e) => setSearchText(e.target.value)} />

                {results.length > 0 && (<div className={styles.searchResults}>
                    <ul>
                        {results.map(user => (
                            <li className={styles.searchResultsRow} key={`user-${user._id}`}>
                                <Link to={`/user/${user._id}`}  onClick={handleRemoveList}>
                                    <img src='https://cdn-icons-png.flaticon.com/128/4333/4333609.png' alt='' />

                                    <span>{user.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>)}

            </div>

            <div className={styles.rightNav}>
                {auth.user && (
                    <div className={styles.user}>
                        <Link to='/settings' >
                            <img src='https://cdn-icons-png.flaticon.com/128/4333/4333609.png' alt='user pic' className={styles.userDp} />
                        </Link>

                        <span>{auth.user.name}</span>
                    </div>
                ) }

                <div className={styles.navLinks}>

                    <ul>
                        {auth.user ?(
                            <>
                                <li>
                                    <button onClick={auth.logout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to='/login' >Login</Link>
                                </li>

                                <li>
                                    <a href='/register'>Register</a>
                                </li>
                            
                            </>
                        )}
                        
                    </ul>
                </div>
            </div>
        </div>
    )
}


export default Navbar;