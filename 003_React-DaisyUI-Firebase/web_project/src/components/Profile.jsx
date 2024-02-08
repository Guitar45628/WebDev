import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Profile() {
    const [profileData, setProfileData] = useState({});
    const [editData, setEditData] = useState({
        name: '',
        height: '',
        weight: '',
        allergic: false,
    });
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const userEmail = JSON.parse(localStorage.getItem('user')).email;
    const path = userEmail.split('@')[0];
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is not logged in
        if (!user) {
            // Redirect to the login page
            navigate('/login');
        } else {
            // Fetch user profile data from Realtime Database
            const db = getDatabase();
            const userRef = ref(db, `BookLab/${path}/user`);

            // Set up a listener to update the state when data changes
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setProfileData(data);
                }
                setLoading(false); // Set loading to false regardless of whether data is available or not
            });
        }
    }, [user, navigate, path]);

    const handleAddModalShow = () => {
        // ล้างข้อมูลใน editData state เพื่อให้ Modal "Add Data" เริ่มต้นที่ข้อมูลว่าง
        setEditData({
            name: '',
            height: '',
            weight: '',
            allergic: false,
        });

        // แสดง Modal "Add Data"
        document.getElementById('add_modal').showModal();
    };

    const handleSaveData = () => {
        // ทำการเช็คข้อมูลที่จำเป็น (ในที่นี้คือ name, height, weight) 
        if (!editData.name || !editData.height || !editData.weight) {
            alert('Please fill in all required fields.'); // แสดงแจ้งเตือนถ้าข้อมูลไม่ครบ
            return;
        }

        // ทำการเช็คว่าข้อมูลที่ต้องการบันทึกตรงตามเงื่อนไขหรือไม่ ถ้าไม่ให้แสดงแจ้งเตือน
        if (isNaN(editData.height) || isNaN(editData.weight) || editData.height <= 0 || editData.weight <= 0) {
            alert('Please enter valid height and weight.');
            return;
        }

        // ทำการบันทึกข้อมูลลงในฐานข้อมูล
        const db = getDatabase();
        const userRef = ref(db, `BookLab/${path}/user`);

        // ถ้าต้องการเพิ่มเงื่อนไขการบันทึกในกรณีที่ต้องการทำเพิ่มเติม
        // if (additionalConditions) {
        //     // Perform additional conditions or modifications before saving
        // }

        // ทำการบันทึกข้อมูล
        update(userRef, {
            Name: editData.name,
            Height: editData.height,
            Weight: editData.weight,
            Allergic: editData.allergic,
            BMI: (editData.weight / ((editData.height / 100) ** 2)).toFixed(2),
        });

        // ปิด Modal "Add Data"
        document.getElementById('add_modal').close();
        showMess('Profile created successfully!', 'success');

    };


    const handleEditModalShow = () => {
        // Populate editData state with current profileData
        setEditData({
            name: profileData.Name,
            height: profileData.Height,
            weight: profileData.Weight,
            allergic: profileData.Allergic,
        });

        // Show the edit modal
        document.getElementById('edit_modal').showModal();
    };

    const handleEditDataChange = (field, value) => {
        // Update the corresponding field in editData state
        setEditData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleEditSubmit = () => {
        // Perform data update logic here
        const db = getDatabase();
        const userRef = ref(db, `BookLab/${path}/user`);

        // Validate input data
        if (!isValidData(editData)) {
            // If validation fails, display an error toast
            showToast('Invalid data. Please check your input.');
            return;
        }

        // Update the user data in the database
        update(userRef, {
            Name: editData.name,
            Height: editData.height,
            Weight: editData.weight,
            Allergic: editData.allergic,
            BMI: (editData.weight / ((editData.height / 100) ** 2)).toFixed(2),
        })
            .then(() => {
                // If the update is successful, close the edit modal
                document.getElementById('edit_modal').close();
                showMess('Profile updated successfully!', 'success');
            })
            .catch((error) => {
                // If there is an error, display an error toast
                showMess(`Error updating profile: ${error.message}`,'error');
            });
    };

    // Helper function to validate input data
    const isValidData = (data) => {
        return (
            data.name.trim() !== '' &&
            !isNaN(data.height) &&
            !isNaN(data.weight) &&
            data.height > 0 &&
            data.weight > 0
        );
    };

    var toastMixin = Swal.mixin({
        toast: true,
        icon: 'success',
        title: 'General Title',
        animation: false,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    // Helper function to display toast messages
    const showMess = (message, iconType = 'success') => {
        const availableIconTypes = ['success', 'error', 'warning', 'info', 'question'];

        if (!availableIconTypes.includes(iconType)) {
            iconType = 'success';
        }

        toastMixin.fire({
            animation: true,
            title: message,
            icon: iconType, // แก้ icon ตรงนี้
        });
    };



    const handleDeleteProfile = () => {
        const db = getDatabase();
        const userRef = ref(db, `BookLab/${path}/user`);

        // ทำการลบข้อมูลโปรไฟล์
        remove(userRef)
            .then(() => {
                console.log('Profile deleted successfully.');
                
                window.location.reload();
            
                // ทำการปิด Modal หากต้องการ
                document.getElementById('delete_modal').close();
                showMess('Profile deleted successfully!', 'success');

            })
            .catch((error) => {
                console.error('Error deleting profile:', error);
                // ทำการปิด Modal หากต้องการ
                document.getElementById('delete_modal').close();
                // หรือทำการแสดงข้อความหรือจัดการผลลัพธ์ลบไม่สำเร็จตามที่ต้องการ
            });
    };



    if (loading) {
        return (
            <div>
                <div className='flex justify-center mt-28'>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className='my-5 mx-10'>
                <div className="text breadcrumbs ps-2">
                    <ul>
                        <li><a href='/home'>หน้าหลัก</a></li>
                        <li><a>โปรไฟล์</a></li>
                    </ul>
                </div>
                <div className="p-5 w-full bg-base-200 rounded-lg">
                    {Object.keys(profileData).length > 0 ? (
                        <div className="flex items-start gap-4">
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-24">
                                    <span className="text-3xl">{profileData.Name[0]}</span>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-semibold mb-5">ข้อมูลส่วนตัว</h1>
                                <p className="mb-2">
                                    <span className="font-semibold">ชื่อ:</span>
                                    <span className="input w-full max-w-xs ml-2">{profileData.Name}</span>
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">ส่วนสูง:</span>
                                    <span className="input w-full max-w-xs ml-2">{profileData.Height}</span>
                                    <span className="font-semibold"> ซม.</span>
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">น้ำหนัก:</span>
                                    <span className="input w-full max-w-xs ml-2">{profileData.Weight}</span>
                                    <span className="font-semibold"> กก.</span>
                                </p>
                                <p className="mb-2">
                                    <span className="font-semibold">ดัชนีมวลกาย:</span>
                                    <span className="input w-full max-w-xs ml-2">{profileData.BMI}</span>
                                </p>
                                <p className="mb-2 flex items-center">
                                    <span className="font-semibold">เป็นภูมิแพ้อากาศ:</span>
                                    <input
                                        type="checkbox"
                                        checked={profileData.Allergic}
                                        readOnly
                                        className="checkbox h-5 w-5 ml-2 text-primary"
                                    />
                                </p>
                                <button className="btn btn-sm btn-active mt-5" onClick={handleEditModalShow}>แก้ไขข้อมูล</button>
                                <button className="btn btn-sm btn-outline btn-error mx-2" onClick={() => document.getElementById('delete_modal').showModal()}>ลบข้อมูล</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p>ระบบไม่มีข้อมูลส่วนตัวสำหรับบัญชี <b>{userEmail}</b> กรุณาเพิ่มข้อมูลส่วนตัวเพื่อให้ระบบทำงานได้อย่างถูกต้อง</p>
                            <button className="btn btn-sm btn-neutral mt-5" onClick={handleAddModalShow}>เพิ่มข้อมูลส่วนตัว</button>
                        </div>
                    )}
                </div>
            </div>

            <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">แก้ไขข้อมูลส่วนตัว</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="form-control col-span-2">
                            <div className="label">
                                <span className="label-text">ชื่อ</span>
                            </div>
                            <input
                                type="text"
                                placeholder="ชื่อ"
                                className="input input-bordered w-full input-sm"
                                value={editData.name}
                                onChange={(e) => handleEditDataChange('name', e.target.value)}
                            />
                        </label>
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">ส่วนสูง(ซม.)</span>
                            </div>
                            <input
                                type="number"
                                min = '0'
                                placeholder="เซนติเมตร"
                                className="input input-bordered w-full input-sm"
                                value={editData.height}
                                onChange={(e) => handleEditDataChange('height', e.target.value)}
                            />
                        </label>
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">น้ำหนัก(กก.)</span>
                            </div>
                            <input
                                type="number"
                                min = '0'
                                placeholder="กิโลกรัม"
                                className="input input-bordered w-full input-sm"
                                value={editData.weight}
                                onChange={(e) => handleEditDataChange('weight', e.target.value)}
                            />
                        </label>
                        <p className="mb-2 flex items-center">
                            <span className="font-semibold">เป็นภูมิแพ้อากาศ:</span>
                            <input
                                type="checkbox"
                                checked={editData.allergic}
                                className="checkbox h-5 w-5 ml-2 text-primary"
                                onChange={(e) => handleEditDataChange('allergic', e.target.checked)}
                            />
                        </p>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-neutral btn-sm" onClick={handleEditSubmit}>บันทึกการเปลี่ยนแปลง</button>
                            <button className="btn btn-sm ms-3" onClick={() => document.getElementById('edit_modal').close()}>ยกเลิก</button>
                        </form>
                    </div>
                </div>
            </dialog>
            {/* Add Data */}
            <dialog id="add_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">เพิ่มข้อมูลส่วนตัว</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="form-control col-span-2">
                            <div className="label">
                                <span className="label-text">ชื่อ-นามสกุล</span>
                            </div>
                            <input
                                type="text"
                                placeholder="ชื่อ"
                                className="input input-bordered w-full input-sm"
                                value={editData.name}
                                onChange={(e) => handleEditDataChange('name', e.target.value)}
                            />
                        </label>
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">ส่วนสูง(ซม.)</span>
                            </div>
                            <input
                                type="number"
                                min = '0'
                                placeholder="เซนติเมตร"
                                className="input input-bordered w-full input-sm"
                                value={editData.height}
                                onChange={(e) => handleEditDataChange('height', e.target.value)}
                            />
                        </label>
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">น้ำหนัก(กก.)</span>
                            </div>
                            <input
                                type="number"
                                min = '0'
                                placeholder="กิโลกรัม"
                                className="input input-bordered w-full input-sm"
                                value={editData.weight}
                                onChange={(e) => handleEditDataChange('weight', e.target.value)}
                            />
                        </label>
                        <p className="mb-2 flex items-center">
                            <span className="font-semibold">เป็นภูมิแพ้อากาศ:</span>
                            <input
                                type="checkbox"
                                checked={editData.allergic}
                                className="checkbox h-5 w-5 ml-2 text-primary"
                                onChange={(e) => handleEditDataChange('allergic', e.target.checked)}
                            />
                        </p>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-neutral btn-sm" onClick={handleSaveData}>บันทึกข้อมูล</button>
                            <button className="btn btn-sm ms-3" onClick={() => document.getElementById('add_modal').close()}>ปิด</button>
                        </form>
                    </div>
                </div>
            </dialog>
            {/* // Del Modal */}
            <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete Profile</h3>
                    <p className="py-4">Are you sure you want to delete your profile?</p>
                    <div className="modal-action">
                        <button className="btn btn-error btn-sm" onClick={handleDeleteProfile}>Delete</button>
                        <button className="btn btn-sm ms-3" onClick={() => document.getElementById('delete_modal').close()}>Cancel</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default Profile;
