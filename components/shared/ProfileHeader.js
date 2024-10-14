"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import AccountProfileModal from "./EditModal";

function ProfileHeader({
  accountId,
  firstname,
  lastname,
  username,
  email,
  imgUrl,
  bio,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <img
              src={imgUrl}
              alt="logo"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {`${firstname} ${lastname}`}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>

        <div
          className="flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2"
          onClick={handleOpenModal}
        >
          <Image src="/assets/edit.svg" alt="logout" width={16} height={16} />

          <p className="text-light-2 max-sm:hidden">Edit</p>
        </div>
      </div>

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

      <div className="mt-12 h-0.5 w-full bg-dark-3" />
      <AccountProfileModal
        isOpen={isModalOpen}
        onOpenChange={(open) => setIsModalOpen(open)}
        onClose={handleCloseModal}
        user={{
          accountId,
          firstname,
          lastname,
          username,
          email,
          imgUrl,
          bio,
        }}
        btnTitle="Save Changes"
      />
    </div>
  );
}

export default ProfileHeader;
