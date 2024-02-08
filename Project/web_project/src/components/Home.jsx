import { getDatabase, ref, onValue, get } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getBMIStatus = (bmi) => {
   if (bmi < 18.5) {
      return 'ผอมแห้ง';
   } else if (bmi >= 18.5 && bmi < 23) {
      return 'ปกติดี';
   } else if (bmi >= 23 && bmi < 25) {
      return 'เหมือนจะอ้วน';
   } else if (bmi >= 25 && bmi < 30) {
      return 'อ้วนแล้ว';
   } else {
      return 'โคตรพอง';
   }
};

const WidgetItem = ({ icon, title, value, desc, isAllergic, bg }) => {
   const [isHovered, setIsHovered] = useState(false);

   const handleHover = () => {
      setIsHovered(!isHovered);
   };

   const widgetStyle = {
      transition: 'transform 0.3s ease-in-out',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      backgroundColor: bg || '#e3f4f4', // กำหนดสีพื้นหลังตามที่รับมาหรือใช้สีเริ่มต้น
   };

   return (
      <div
         className="stats shadow m-2"
         style={widgetStyle}
         onMouseEnter={handleHover}
         onMouseLeave={handleHover}
      >
         <div className="stat px-2 py-3">
            <div className='grid grid-cols-3'>
               <div className="flex items-center justify-center col-span-1">
                  <img className='w-12' src={icon} alt="" />
               </div>
               <div >
                  <div className="stat-title text-black">{title}</div>
                  <div className="stat-value text-black">{value || "-"}</div>
                  <div className="stat-desc text-black">{desc}{isAllergic ? (isAllergic ? 'ใช่' : 'ไม่ใช่') : ''}</div>
               </div>
            </div>
         </div>
      </div>
   );
};

const Home = () => {
   const [profileData, setProfileData] = useState({});
   const [dhtData, setDHTData] = useState({});
   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
   const navigate = useNavigate();
   const [hasProfile, setHasProfile] = useState(true);

   useEffect(() => {
      if (!user || !user.email) {
         // Redirect to the login page if user data or email is missing
         navigate('/login');
      } else {
         hasProfileData().then((result) => {
            setHasProfile(result);
         });
      }
   }, [user, navigate]);

   const userEmail = user ? user.email : '';
   const path = userEmail.split('@')[0];

   const setUserProfileDataListener = (userRef) => {
      onValue(userRef, (snapshot) => {
         const data = snapshot.val();
         if (data) {
            setProfileData(data);
            // console.log(data)
         }
      });
   };

   const setDHTDataListener = (dhtRef) => {
      onValue(dhtRef, (snapshot) => {
         const dhtData = snapshot.val();
         if (dhtData) {
            setDHTData(dhtData);
            // console.log(dhtData)
         }
      });
   };

   const hasProfileData = () => {
      const db = getDatabase();
      const userRef = ref(db, `BookLab/${path}/user`);
      const dhtRef = ref(db, `BookLab/${path}/realtime`);

      return get(userRef)
         .then((snapshot) => {
            if (snapshot.exists()) {
               setUserProfileDataListener(userRef);
            }
            return get(dhtRef);
         })
         .then((dhtSnapshot) => {
            if (dhtSnapshot.exists()) {
               setDHTDataListener(dhtRef);
            }
            return true;
         })
         .catch((error) => {
            console.error('Error checking profile data:', error);
            return false;
         });
   };

   const closeModal = () => {
      const modal = document.getElementById('my_modal_1');
      modal.close();
   };

   return (
      <div>
         <h1 className='text-3xl mt-5 ms-10 '><b>สวัสดี {profileData.Name} !</b></h1>
         <div className='grid mx-8 h-full'>
            <div className="grid sm:grid-cols-1 md:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-10 h-fit">
               {/* Content goes here */}
               {/* item 1 */}
               <WidgetItem
                  icon="https://cdn-icons-png.flaticon.com/128/6558/6558492.png"
                  title="ดัชนีมวลกาย"
                  value={profileData.BMI}
                  desc={getBMIStatus(profileData.BMI)}
                  bg="#e3f4f4"
               />

               {/* item 2 */}
               <WidgetItem
                  icon="https://cdn-icons-png.flaticon.com/128/4087/4087669.png"
                  title="น้ำหนัก"
                  value={profileData.Weight}
                  desc="กิโลกรัม"
                  bg="#ffdeb4"
               />

               {/* item 3 */}
               <WidgetItem
                  icon="https://cdn-icons-png.flaticon.com/128/12317/12317278.png"
                  title="ส่วนสูง"
                  value={profileData.Height}
                  desc="เซนติเมตร"
                  bg="#e9edc9"
               />

               {/* item 4 */}
               <WidgetItem
                  icon="https://cdn-icons-png.flaticon.com/128/4365/4365116.png"
                  title="ภูมิแพ้อากาศ"
                  value={profileData.Allergic ? 'ใช่' : 'ไม่ใช่' || '-'}
                  desc="โรคประจำตัว"
                  isAllergic
                  bg="#d3cedf"
               />

               {/* item 5 */}
               <WidgetItem
                  icon="https://cdn-icons-png.flaticon.com/128/14045/14045714.png"
                  title="ชีพจร(ปลอม)"
                  value="85"
                  desc="BPM"
                  bg="#f2d6da"
               />

               {/* item 6 */}
               <WidgetItem
                  icon="https://cdn-icons-png.flaticon.com/128/7974/7974720.png"
                  title="อุณหภูมิห้อง"
                  value={dhtData.temperature}
                  desc="องศาเซลเซียส"
                  bg="#EEE7DA"
               />

               {/* item 7 */}
               <WidgetItem
                  icon="https://cdn-icons-png.flaticon.com/128/727/727790.png"
                  title="ความชื้นห้อง"
                  value={dhtData.humidity}
                  desc="เปอร์เซ็นต์"
                  bg="#93C6E7"
               />

            </div>

            {!hasProfile && document.getElementById('my_modal_1').showModal()}
            {/* // <div role="alert" className="alert w-3/5 shadow-2xl mt-10 flex flex-col items-center" style={{ position: 'fixed', zIndex: '9999' }}>
               //    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
               //    <span>Your account doesn't have a profile for predictions. Please add a profile now.</span>
               //    <div>
               //       <button className="btn btn-neutral btn-sm me-1" onClick={() => navigate('/profile')}>Go to Profile</button>
               //    </div>
               // </div> */}
            <dialog id="my_modal_1" className="modal">
               <div className="modal-box ">
                  <h3 className="font-bold text-lg">บัญชีนี้ยังไม่ได้ระบุข้อมูลส่วนตัว</h3>
                  <p className="pt-2">บัญชี <u>{userEmail}</u> ยังไม่มีการบันทึกข้อมูลส่วนตัวจึงไม่สามารถใช้งานได้ จำเป็นต้องระบุข้อมูลส่วนตัวบางรายการเพื่อให้ระบบทำงานได้อย่างถูกต้อง</p>
                  <div className="modal-action m-1">
                     <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-outline" onClick={() => { navigate('/profile'); closeModal(); }}>ไปยังหน้า Profile</button>
                     </form>
                  </div>
               </div>
            </dialog>
         </div>
      </div>
   );
}

export default Home;
