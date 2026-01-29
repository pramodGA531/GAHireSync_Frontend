import React, { memo } from "react";
import LoadingGif from "../../../assets/Loader.gif";

const Pageloading = memo(() => {
    return (
        <div className="flex justify-center items-center h-[75vh] w-full mx-auto">
            <main className="py-6">
                <img src={LoadingGif} alt="" />
            </main>
        </div>
    );
});

export default Pageloading;
