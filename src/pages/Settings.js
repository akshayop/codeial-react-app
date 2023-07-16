import { useState } from "react";
import { useAuth } from "../hooks";
import styles from "../styles/settings.module.css";
import { toast } from "react-toastify";

const Settings = () => {
    const auth = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(auth.user?.name ? auth.user.name : '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [savingForm, setSavingForm] = useState(false);

    const clearForm = () => {
        setPassword('');
        setConfirmPassword('');
    }
    
    const updateProfile = async () => {
        setSavingForm(true);

        let error = false;

        if(!name || !password || !confirmPassword) {
            toast.error('Please, fill all the fileds');
            error = true;
        }

        else if(password !== confirmPassword) {
            toast.error('Password and Confirm password does not match');
            error = true;
        }

        if( error ) {
            return setSavingForm(false);
        }

        const res = await auth.updateUser(auth.user._id, name, password, confirmPassword);

        if(res.success) {

            setEditMode(false);
            setSavingForm(false);
            clearForm();

            return toast.success('User Updated Successfully');

        } else {
            toast.error(res.message);
        }

        setSavingForm(false);
    }

    return (
        <div className={styles.settings}>
            <div className={styles.imgContainer}>
                <img src="https://cdn-icons-png.flaticon.com/128/4333/4333609.png" alt="Profile Pic" />
            </div>

            <div className={styles.field}>
                <div className={styles.fieldLabel}>Email:</div>
                <div className={styles.fieldValue}>{auth.user?.email}</div>    
            </div>

            <div className={styles.field}>
                <div className={styles.fieldLabel}>Name:</div>
                {editMode ? (
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                ) : (
                    <div className={styles.fieldValue}>{auth.user?.name}</div>  
                ) }  {/*Basically this is also a kind of ternary operator*/}
                
                 
            </div>

            {editMode && (
                <>
                    <div className={styles.field}>
                        <div className={styles.fieldLabel}>password</div>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>  
                    </div>

                    <div className={styles.field}>
                        <div className={styles.fieldLabel}>Confirm Password</div>
                        <input type="password"  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /> 
                    </div>
                </>
            )}

            

            <div className={styles.btnGrp}>

                {editMode ? (
                    <>
                        <button className={`button ${styles.saveBtn}`} onClick={updateProfile} disabled={savingForm}>
                            {savingForm ? 'Saving Profile.....' : 'Save Profile'}
                        </button>
                        
                        <button className={`button ${styles.editBtn}`} onClick={() => setEditMode(false) } >Go Back</button>
                    </>
                   
                ) : (
                    <button className={`button ${styles.editBtn}`} onClick={() => setEditMode(true)}>Edit Profile</button> 
                )}
            </div> 
        </div>
    )
}

export default Settings;