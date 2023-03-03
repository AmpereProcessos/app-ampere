import React, { useState } from "react";
import Image from "next/image";
import { MdOutlineSecurity } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
function CardControleUsuarios({ userInfo, admin, openModal }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [dropdownVisible, setDropDownVisible] = useState(false);
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between px-4 pt-4">
        {admin ? (
          <MdOutlineSecurity
            style={{ fontSize: "25px", color: "rgb(34,197,94)" }}
          />
        ) : (
          <div></div>
        )}
        <div className="relative">
          <button
            id="dropdownButton"
            data-dropdown-toggle="dropdown"
            onClick={() => setDropDownVisible((prevState) => !prevState)}
            className="inline-block text-gray-500  hover:bg-gray-100 rounded-lg text-sm p-1.5"
            type="button"
          >
            <span className="sr-only">Open dropdown</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
          </button>
          {dropdownVisible && (
            <div
              onClick={openModal}
              id="dropdown"
              className="absolute z-1 mr-7 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul className="py-2" aria-labelledby="dropdownButton">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Editar
                  </a>
                </li>
                {session.user.tier == "ADMIN" && (
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Inativar
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center pb-10">
        {userInfo.avatar_url ? (
          <div className="mb-3 rounded-full relative w-[96px] h-[96px]">
            <Image
              src={userInfo.avatar_url}
              // width={96}
              // height={96}
              fill={true}
              layout={"fill"}
              style={{ borderRadius: "100%", objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="mb-3 rounded-full relative w-[96px] h-[96px] bg-gray-600 flex items-center justify-center">
            <FaUser style={{ color: "white", fontSize: "35px" }} />
          </div>
        )}

        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {userInfo.nome}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {userInfo.email}
        </span>
      </div>
    </div>
  );
}

export default CardControleUsuarios;
