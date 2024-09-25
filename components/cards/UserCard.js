import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { IoMdPersonAdd } from "react-icons/io";
import { FaUserCheck } from "react-icons/fa";

function UserCard({ id, name, username, imgUrl, isFollowing, isCurrentUser }) {


  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <div className="relative h-12 w-12">
          <img
            src={imgUrl}
            alt="user_logo"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1 cursor-pointer">
            {name}
          </h4>
          <p className="text-small-medium text-gray-1 cursor-pointer">
            @{username}
          </p>
        </div>
      </div>

      {!isCurrentUser && (
        <Button
          className={`user-card_btn ${
            isFollowing ? "bg-gray-500 hover:bg-gray-600" : ""
          }`}
        >
          {isFollowing ? (
            <>
              <FaUserCheck size={18} className="mr-2" /> Following
            </>
          ) : (
            <>
              <IoMdPersonAdd size={18} className="mr-2" /> Follow
            </>
          )}
        </Button>
      )}
    </article>
  );
}

export default UserCard;
