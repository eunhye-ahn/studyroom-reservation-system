import { useNavigate } from "react-router-dom";
import AsideSection from "../components/aside/AsideSection";
import Footer from "../components/layout/Footer";
import MainSection from "../components/layout/MainSection";
import DateTimeDisplay from "../components/layout/DateTimeDisplay";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-[#2d2d2d]">

            <div>
                <DateTimeDisplay/>
            </div>

            <div className="flex flex-1">

                <main className="flex-1 p-8">
                    <MainSection />
                    <button onClick={() => navigate("/myReservation")}>나의 자리</button>
                    <button onClick={() => navigate("/roomList")}>열람실</button>



                </main>
                <aside className="w-[450px] bg-[#000000] opacity-67 p-6 relative">
                    <AsideSection />
                </aside>


            </div>

            <footer className=" fixed bottom-10 left-15  w-full">
                <Footer/>
            </footer>
        </div>

    )
}

export default Home;