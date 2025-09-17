import useUserStore from "../stores/useUserStore";

function Profile() {
  const user = useUserStore((state) => state.user);


  if (!user) {
    return <div>로그인 정보 없음</div>;
  }


  return (
    <div className="min-h-screen  flex flex-col items-start justify-center pl-30" >
      <div className="pb-5">
        <img src="/icons/User.png" className="w-20" alt="유저" />
      </div>
      <div className="flex flex-col gap-2">
        <p>{user.role}</p>
        <p className="text-4xl font-bold">{user.name}</p>
        <p>{user.email}</p>
      </div>
    </div>
  )
}
export default Profile;