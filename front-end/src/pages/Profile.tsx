import useUserStore from "../stores/useUserStore";

function Profile(){
    const user = useUserStore((state) => state.user);


  if (!user) {
    return <div>로그인 정보 없음</div>;
  }


    return(
        <div>
            <h2>나의 프로필</h2>
            <p><strong>이름: </strong>{user.name}</p>
            <p><strong>이메일: </strong>{user.email}</p>
            <p><strong>역할: </strong>{user.role}</p>
        </div>
    )
}
export default Profile;