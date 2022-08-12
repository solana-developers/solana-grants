import { FC, useState } from "react";

export const Footer: FC = () => {
  const [showDropdown, setshowDropdown] = useState(false);

  const onClickDropdown = () => {
    if (showDropdown === true) {
      setshowDropdown(false);
    } else {
      setshowDropdown(true);
    }
  };

  return (
    <div className="">
      <footer className="text-center xl:h-[190px] relative lg:text-left">
        {/* <div className="lg:overflow-hidden md:overflow-visible h-[260px] absolute right-0 bottom-0">
          <svg
            width="1600"
            height="633"
            viewBox="0 0 1600 633"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity=".25"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M220.205 297.019c-25.528 15.079-48.068 34.499-65.456 58.871-93.31 130.789-377.638 580.463 1.725 734.08 262.311 106.23 1105.006 237.64 1487.626-38.84 92.06-66.52 8.18-534.506-47.74-798.399-22.87-107.948-112.68-186.889-219.63-197.154L812.019 1.376C760.896-3.531 709.816 7.81 665.72 33.857L220.205 297.02Z"
              fill="url(#a)"
            />
            <defs>
              <linearGradient
                id="a"
                x1="-378.062"
                y1="685.433"
                x2="125.035"
                y2="-766.8"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9945FF" />
                <stop offset="1" stopColor="#14F195" />
              </linearGradient>
            </defs>
          </svg>
        </div> */}
        <div className="mx-6 px-20 md:px-10 xl:px-15 text-center absolute top-0 md:text-left">
          <div className="grid lg:grid-cols-5 mb-6 mt-6 place-items-center md:grid-cols-2 gap-4">
            <div className="">
              <h6 className="uppercase text-thistle font-montserrat font-bold mb-4 flex items-center justify-center md:justify-start">
                <div className="mr-2">
                  <svg
                    className="w-[80%] xl:w-[100%]"
                    width="100%"
                    height="30"
                    viewBox="0 0 101 88"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100.48 69.3817L83.8068 86.8015C83.4444 87.1799 83.0058 87.4816 82.5185 87.6878C82.0312 87.894 81.5055 88.0003 80.9743 88H1.93563C1.55849 88 1.18957 87.8926 0.874202 87.6912C0.558829 87.4897 0.31074 87.2029 0.160416 86.8659C0.0100923 86.529 -0.0359181 86.1566 0.0280382 85.7945C0.0919944 85.4324 0.263131 85.0964 0.520422 84.8278L17.2061 67.408C17.5676 67.0306 18.0047 66.7295 18.4904 66.5234C18.9762 66.3172 19.5002 66.2104 20.0301 66.2095H99.0644C99.4415 66.2095 99.8104 66.3169 100.126 66.5183C100.441 66.7198 100.689 67.0067 100.84 67.3436C100.99 67.6806 101.036 68.0529 100.972 68.415C100.908 68.7771 100.737 69.1131 100.48 69.3817ZM83.8068 34.3032C83.4444 33.9248 83.0058 33.6231 82.5185 33.4169C82.0312 33.2108 81.5055 33.1045 80.9743 33.1048H1.93563C1.55849 33.1048 1.18957 33.2121 0.874202 33.4136C0.558829 33.6151 0.31074 33.9019 0.160416 34.2388C0.0100923 34.5758 -0.0359181 34.9482 0.0280382 35.3103C0.0919944 35.6723 0.263131 36.0083 0.520422 36.277L17.2061 53.6968C17.5676 54.0742 18.0047 54.3752 18.4904 54.5814C18.9762 54.7875 19.5002 54.8944 20.0301 54.8952H99.0644C99.4415 54.8952 99.8104 54.7879 100.126 54.5864C100.441 54.3849 100.689 54.0981 100.84 53.7612C100.99 53.4242 101.036 53.0518 100.972 52.6897C100.908 52.3277 100.737 51.9917 100.48 51.723L83.8068 34.3032ZM1.93563 21.7905H80.9743C81.5055 21.7907 82.0312 21.6845 82.5185 21.4783C83.0058 21.2721 83.4444 20.9704 83.8068 20.592L100.48 3.17219C100.737 2.90357 100.908 2.56758 100.972 2.2055C101.036 1.84342 100.99 1.47103 100.84 1.13408C100.689 0.79713 100.441 0.510296 100.126 0.308823C99.8104 0.107349 99.4415 1.24074e-05 99.0644 0L20.0301 0C19.5002 0.000878397 18.9762 0.107699 18.4904 0.313848C18.0047 0.519998 17.5676 0.821087 17.2061 1.19848L0.524723 18.6183C0.267681 18.8866 0.0966198 19.2223 0.0325185 19.5839C-0.0315829 19.9456 0.0140624 20.3177 0.163856 20.6545C0.31365 20.9913 0.561081 21.2781 0.875804 21.4799C1.19053 21.6817 1.55886 21.7896 1.93563 21.7905Z"
                      fill="url(#paint0_linear_174_4403)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_174_4403"
                        x1="8.52558"
                        y1="90.0973"
                        x2="88.9933"
                        y2="-3.01622"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0.08" stopColor="#9945FF" />
                        <stop offset="0.3" stopColor="#8752F3" />
                        <stop offset="0.5" stopColor="#5497D5" />
                        <stop offset="0.6" stopColor="#43B4CA" />
                        <stop offset="0.72" stopColor="#28E0B9" />
                        <stop offset="0.97" stopColor="#19FB9B" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <p className="text-white font-bold cursor-default font-quantico text-xl xl:text-3xl ">
                  GRANTS
                </p>
              </h6>
              <p className="text-sm xl:text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. -
                Consequatur consequuntur dolorum error impedit ipsum porro qui -
                ut. Animi beatae blanditiis earum iusto labore neque non -
                quibusdam quisquam, quod similique vero.
              </p>
            </div>
            <div className="text-sm xl:text-base">
              <h6 className="uppercase text-thistle font-montserrat font-bold mb-4 flex justify-center md:justify-start text-base">
                Community
              </h6>
              <p className="mb-4">
                <a href="components/common/Footer#" className="text-white">
                  Donec dignissim
                </a>
              </p>
              <p className="mb-4">
                <a href="components/common/Footer#" className="text-white">
                  Curabitur egestas
                </a>
              </p>
              <p className="mb-4">
                <a href="components/common/Footer#" className="text-white">
                  Curabitur egestas
                </a>
              </p>
              <p className="mb-4">
                <a href="components/common/Footer#" className="text-white">
                  Curabitur egestas
                </a>
              </p>
            </div>
            <div className="text-sm xl:text-base">
              <h6 className="uppercase text-thistle font-montserrat font-bold mb-4 flex justify-center md:justify-start text-base">
                Services
              </h6>
              <p className="mb-4">
                <a href="components/common/Footer#" className="text-white">
                  Donec dignissim
                </a>
              </p>
              <p className="mb-4">
                <a href="components/common/Footer#" className="text-white">
                  Curabitur egestas
                </a>
              </p>
              <p className="mb-4">
                <a href="components/common/Footer#" className="text-white">
                  Donec dignissim
                </a>
              </p>
              <p className="mb-4">
                <a href="components/common/Footer#" className="text-white">
                  Curabitur egestas
                </a>
              </p>
            </div>
            <div className="text-sm xl:text-base">
              <h6 className="uppercase text-thistle font-montserrat font-bold mb-4 flex justify-center md:justify-start text-base">
                resources
              </h6>
              <p className="mb-4">
                <a href="components/common/Footer#" className="text-white">
                  Donec dignissim
                </a>
              </p>
              <p className="mb-4">
                <a href="components/common/Footer#" className="text-white">
                  Curabitur egestas
                </a>
              </p>
              <p className="mb-4">
                <a href="components/common/Footer#" className="text-white">
                  Donec dignissim
                </a>
              </p>
              <p className="mb-4">
                <a href="components/common/Footer#" className="text-white">
                  Curabitur egestas
                </a>
              </p>
            </div>
            <div className="">
              <button
                id="dropdownDefault"
                data-dropdown-toggle="dropdown"
                className="text-white hover:bg-gray-600 border-magenta font-montserrat font-bold rounded-md text-md py-2.5 pl-2 inline-flex items-center border dark:hover:bg-gray-600 dark:focus:ring-blue-800"
                type="button"
                onClick={() => {
                  onClickDropdown();
                }}
              >
                <svg
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  fillRule="evenodd"
                  className="mr-2 fill-white"
                  clipRule="evenodd"
                >
                  <path d="M12.02 0c6.614.011 11.98 5.383 11.98 12 0 6.623-5.376 12-12 12-6.623 0-12-5.377-12-12 0-6.617 5.367-11.989 11.981-12h.039zm3.694 16h-7.427c.639 4.266 2.242 7 3.713 7 1.472 0 3.075-2.734 3.714-7m6.535 0h-5.523c-.426 2.985-1.321 5.402-2.485 6.771 3.669-.76 6.671-3.35 8.008-6.771m-14.974 0h-5.524c1.338 3.421 4.34 6.011 8.009 6.771-1.164-1.369-2.059-3.786-2.485-6.771m-.123-7h-5.736c-.331 1.166-.741 3.389 0 6h5.736c-.188-1.814-.215-3.925 0-6m8.691 0h-7.685c-.195 1.8-.225 3.927 0 6h7.685c.196-1.811.224-3.93 0-6m6.742 0h-5.736c.062.592.308 3.019 0 6h5.736c.741-2.612.331-4.835 0-6m-12.825-7.771c-3.669.76-6.671 3.35-8.009 6.771h5.524c.426-2.985 1.321-5.403 2.485-6.771m5.954 6.771c-.639-4.266-2.242-7-3.714-7-1.471 0-3.074 2.734-3.713 7h7.427zm-1.473-6.771c1.164 1.368 2.059 3.786 2.485 6.771h5.523c-1.337-3.421-4.339-6.011-8.008-6.771" />
                </svg>
                <p className="text-sm xl:text-base">English - En</p>
                <svg
                  className="w-8 xl:w-10 h-4 ml-2 xl:ml-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showDropdown && (
                <div
                  id="dropdown"
                  className="z-10 bg-gray-600 divide-y divide-gray-100 rounded shadow dark:bg-gray-700 w-full"
                >
                  <ul
                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownDefault"
                  >
                    <li>
                      <a
                        href="components/common/Footer#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="components/common/Footer#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="components/common/Footer#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Earnings
                      </a>
                    </li>
                    <li>
                      <a
                        href="components/common/Footer#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
