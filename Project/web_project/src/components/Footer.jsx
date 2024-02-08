function Footer() {
    return (
        //   <footer className="footer fixed bottom-0 w-full p-4 bg-base-300 text-base-content flex items-center justify-center">
        //     <aside className="text-center">
        //     <div className="flex items-center justify-center">
        //       <img src="../../src/assets/DTM_LOGO.png" alt="DTM Logo" className="mx-4" width={'50px'} />
        //       <img src="../../src/assets/WU.png" alt="WU Logo" className="mx-4" width={'50px'} />
        //     </div>
        //       <p>Copyright © 2024 - All rights reserved by Booklab Ltd</p>
        //     </aside>
        //   </footer>

        
            
        
        <footer class="footer Fixed bottom-0 mt-auto bg-base-200 text-base-content">
            <div class="w-full p-4 py-2 justify-center">
                <div class="lg:flex justify-between">
                    <div className="grid grid-cols-3">
                    <img src="../../src/assets/DTM_LOGO.png" alt="IMI Logo" className="mx-auto xs:h-16 md:h-20 lg:h-24" />
                    <img src="../../src/assets/info.png" alt="Informatic Logo" className="mx-auto xs:h-16 md:h-20 lg:h-24" />
                    <img src="../../src/assets/book.png" alt="WU Logo" className="mx-auto xs:h-16 md:h-20 lg:h-24" />
                    </div>
                    <div className="divider sm:divider-verticle lg:divider-horizontal"></div>
                    <div class="col-start-3 text-center">
                        <div className="font-semibold"><p>หลักสูตรเทคโนโลยีดิจิทัลทางการแพทย์</p>
                            <p>สาขาวิชาเทคโนโลยีสารสนเทศ</p>
                            <p>สำนักวิชาสารสนเทศศาสตร์ มหาวิทยาลัยวลัยลักษณ์</p></div>
                        <div>
                            <p className="font-thin">222 ตำบลไทยบุรี อำเภอท่าศาลา จังหวัดนครศรีธรรมราช 80160</p>
                            <p>Copyright© 2024 | All rights reserved by Booklab</p></div>
                    </div>
                </div>

                {/* <div class="border-t-2">
                    <span class="text-sm">
                        © 2024 Booklab | All Rights Reserved.
                    </span>
                </div> */}
            </div>
        </footer>

    );
}

export default Footer;
