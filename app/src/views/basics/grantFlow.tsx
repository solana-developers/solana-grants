import React, { FC, useState } from "react";
import { Input } from "../markdownConvert";

export const GrantCreationFlowView: FC = ({}) => {
  enum DescriptionTab {
    Write = "Write",
    Preview = "Preview",
  }

  const [active, setActive] = useState(1);

  const [hideTextArea, setHideTextArea] = useState(false);

  const tabColors = {
    selectedTabColor: "#2514ED",
    selectedTabBgColor: "#e5e7eb",
    deselectedTabColor: "#9ca3af",
    deselectedTabBgColor: "#f9fafb",
  };

  const [descriptionTab, setDescriptionTab] = useState({
    writeTabColor: tabColors.selectedTabColor,
    writeTabBgColor: tabColors.selectedTabBgColor,
    previewTabColor: tabColors.deselectedTabColor,
    previewTabBgColor: tabColors.deselectedTabBgColor,
  });

  const selectTab = (descriptionTab: DescriptionTab) => {
    if (descriptionTab === DescriptionTab.Write) {
      setDescriptionTab({
        writeTabColor: tabColors.selectedTabColor,
        writeTabBgColor: tabColors.selectedTabBgColor,
        previewTabColor: tabColors.deselectedTabColor,
        previewTabBgColor: tabColors.deselectedTabBgColor,
      });
      setHideTextArea(false);
    } else {
      setDescriptionTab({
        writeTabColor: tabColors.deselectedTabColor,
        writeTabBgColor: tabColors.deselectedTabBgColor,
        previewTabColor: tabColors.selectedTabColor,
        previewTabBgColor: tabColors.selectedTabBgColor,
      });
      setHideTextArea(true);
    }
  };

  return (
    <>
      <div className=" w-[63rem] absolute top-[10%] left-[23%]">
        <div className="mx-4 p-4">
          <div className="flex items-center">
            <div className="flex items-center text-white relative">
              <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 bg-teal-600 border-teal-600"></div>
              <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-teal-600">
                Grant Details
              </div>
            </div>
            <div
              className={
                active == 2 || active == 3 || active == 4
                  ? "flex-auto border-t-2 transition duration-500 ease-in-out border-teal-600"
                  : "flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"
              }
            ></div>
            <div className="flex items-center text-gray-500 relative">
              <div
                className={
                  active == 2 || active == 3 || active == 4
                    ? "rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 bg-teal-600 border-teal-600"
                    : "rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300"
                }
              ></div>
              <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">
                Creator Details
              </div>
            </div>
            <div
              className={
                active == 3 || active == 4
                  ? "flex-auto border-t-2 transition duration-500 ease-in-out border-teal-600"
                  : "flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"
              }
            ></div>
            <div className="flex items-center text-gray-500 relative">
              <div
                className={
                  active == 3 || active == 4
                    ? "rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 bg-teal-600 border-teal-600"
                    : "rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300"
                }
              ></div>
              <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">
                Review Grant
              </div>
            </div>
            <div
              className={
                active == 4
                  ? "flex-auto border-t-2 transition duration-500 ease-in-out border-teal-600"
                  : "flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"
              }
            ></div>
            <div className="flex items-center text-gray-500 relative">
              <div
                className={
                  active == 4
                    ? "rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 bg-teal-600 border-teal-600"
                    : "rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300"
                }
              ></div>
              <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">
                Create Grant
              </div>
            </div>
          </div>
        </div>
        <div className="border-t-2 w-[63rem] mt-[4rem]  border-gray-300"></div>
        <div className={active == 1 ? "mt-8 p-4" : "hidden"}>
          <div>
            <div className="font-bold text-white text-xl leading-8 uppercase h-6 mx-2 mt-3">
              <h1>Grant Details</h1>
            </div>

            <div className="font-bold text-white text-s leading-8 uppercase h-6 mx-2 mt-3">
              Title*
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full flex-1 mx-2 svelte-1l8159u">
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Grant Title"
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  About*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="About.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-black text-s leading-8 uppercase">
                  {" "}
                  Description*
                </div>
                <div className="bg-gray-50 border border-b-0 border-gray-300 top-0 mt-2 left-0 right-0 block rounded-t-md">
                  <button
                    type="button"
                    style={{
                      color: descriptionTab.writeTabColor,
                      backgroundColor: descriptionTab.writeTabBgColor,
                    }}
                    className={`py-2 px-4 inline-block font-semibold rounded`}
                    onClick={() => {
                      selectTab(DescriptionTab.Write);
                    }}
                  >
                    {" "}
                    Write
                  </button>
                  <button
                    type="button"
                    style={{
                      color: descriptionTab.previewTabColor,
                      backgroundColor: descriptionTab.previewTabBgColor,
                    }}
                    className={`py-2 px-4 inline-block font-semibold rounded`}
                    onClick={() => {
                      selectTab(DescriptionTab.Preview);
                    }}
                  >
                    Preview
                  </button>
                </div>
                <div className="bg-white p-1 flex border border-gray-200 svelte-1l8159u rounded-b-md text-black">
                  <Input hide={hideTextArea} />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  Project Header URl*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Your Project Header URl.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  Project GitHub URl*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Your Project GitHub URl.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  Project Website*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Your Project Website.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  Amount Goal in USD*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Amount Goal.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex p-2 mt-4">
            <div className="flex-auto flex flex-row-reverse">
              <button
                className="text-base  ml-2  hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer
        hover:bg-teal-600
        bg-teal-600
        text-teal-100
        border duration-200 ease-in-out
        border-teal-600 transition"
                disabled={active == 4}
                onClick={() => {
                  setActive(active + 1);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className={active == 2 ? "mt-8 p-4" : "hidden"}>
          <div>
            <div className="font-bold text-white text-xl leading-8 uppercase h-6 mx-2 mt-3">
              <h1>Creator Details</h1>
            </div>

            <div className="font-bold text-white text-s leading-8 uppercase h-6 mx-2 mt-3">
              Name*
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full flex-1 mx-2 svelte-1l8159u">
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Grant Title"
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  GitHub Handle*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="About.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  Wallet Address
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Grant Description.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex p-2 mt-4">
            <button
              className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer
        hover:bg-gray-200
        bg-gray-100
        text-gray-700
        border duration-200 ease-in-out
        border-gray-600 transition"
              disabled={active == 1}
              onClick={() => {
                setActive(active - 1);
              }}
            >
              Previous
            </button>
            <div className="flex-auto flex flex-row-reverse">
              <button
                className="text-base  ml-2  hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer
        hover:bg-teal-600
        bg-teal-600
        text-teal-100
        border duration-200 ease-in-out
        border-teal-600 transition"
                disabled={active == 4}
                onClick={() => {
                  setActive(active + 1);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className={active == 3 ? "mt-8 p-4" : "hidden"}>
          <div className="font-bold text-white text-2xl leading-8 uppercase h-6 mx-2 mt-3">
            <h1>Review Grants</h1>
          </div>
          <div className="border-t-2 w-[63rem] mt-[3rem]  border-gray-300"></div>
          <div>
            <div className="font-bold text-white text-xl leading-8 uppercase h-6 mx-2 mt-3">
              <h1>Grant Details</h1>
            </div>

            <div className="font-bold text-white text-s leading-8 uppercase h-6 mx-2 mt-3">
              Title*
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full flex-1 mx-2 svelte-1l8159u">
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Grant Title"
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  About*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="About.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  Description*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Grant Description.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  Project Header URl*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Your Project Header URl.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  Project GitHub URl*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Your Project GitHub URl.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  Project Website*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Your Project Website.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  Amount Goal in USD*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Amount Goal.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="font-bold text-white text-xl leading-8 uppercase h-6 mx-2 mt-3">
              <h1>Creator Details</h1>
            </div>

            <div className="font-bold text-white text-s leading-8 uppercase h-6 mx-2 mt-3">
              Name*
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full flex-1 mx-2 svelte-1l8159u">
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Grant Title"
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  GitHub Handle*
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="About.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row">
              <div className="w-full mx-2 flex-1 svelte-1l8159u">
                <div className="font-bold h-6 mt-3 text-white text-s leading-8 uppercase">
                  {" "}
                  Wallet Address
                </div>
                <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                  <input
                    placeholder="Grant Description.."
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex p-2 mt-4">
            <button
              className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer
        hover:bg-gray-200
        bg-gray-100
        text-gray-700
        border duration-200 ease-in-out
        border-gray-600 transition"
              disabled={active == 1}
              onClick={() => {
                setActive(active - 1);
              }}
            >
              Previous
            </button>
            <div className="flex-auto flex flex-row-reverse">
              <button
                className="text-base  ml-2  hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer
        hover:bg-teal-600
        bg-teal-600
        text-teal-100
        border duration-200 ease-in-out
        border-teal-600 transition"
                disabled={active == 4}
                onClick={() => {
                  setActive(active + 1);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className={active == 4 ? "mt-8 p-4" : "hidden"}>
          <div>
            <div className="font-bold text-white text-xl leading-8 uppercase h-6 mx-2 mt-3">
              <h1>Creating Grant</h1>
            </div>
          </div>
          <div className="flex p-2 mt-4">
            <button
              className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer
        hover:bg-gray-200
        bg-gray-100
        text-gray-700
        border duration-200 ease-in-out
        border-gray-600 transition"
              disabled={active == 1}
              onClick={() => {
                setActive(active - 1);
              }}
            >
              Previous
            </button>
            <div className="flex-auto flex flex-row-reverse">
              <button
                className="text-base  ml-2  hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer
        hover:bg-teal-600
        bg-teal-600
        text-teal-100
        border duration-200 ease-in-out
        border-teal-600 transition"
                disabled={active == 4}
                onClick={() => {
                  setActive(active + 1);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
