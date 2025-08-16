import { useNavigate } from "react-router-dom";
import AsideSection from "../components/aside/AsideSection";
import Footer from "../components/layout/Footer";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen">

<div className="p-6">
                <img src="/icons/Logo.svg" alt="순천대학교" className="h-14" /><br />
</div>

            <div className="flex flex-1">

                <main className="flex-1 p-8 bg-white">
                    <button onClick={() => navigate("/profile")}>나의 프로필</button>
                    <button onClick={() => navigate("/myReservation")}>나의 자리</button>
                    <button onClick={() => navigate("/roomList")}>열람실</button>



                </main>
                <aside className="w-[300px] bg-[#2E22AC] text-white p-6">
                    <AsideSection />
                </aside>


            </div>

            <footer className="bg-gray-500 flex justify-center items-center h-[60px]">
                <Footer/>
            </footer>
        </div>

    )
}

export default Home;