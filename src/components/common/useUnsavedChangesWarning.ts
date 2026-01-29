import { useEffect, useRef } from "react";
import { Modal } from "antd";

export const SetupCustomExitHandler = (shouldWarn: boolean, onSave: () => void) => {
    const warnedRef = useRef(false);

    const showExitModal = (event?: Event) => {
        if (!shouldWarn || warnedRef.current) return;

        event?.preventDefault();
        warnedRef.current = true;

        Modal.confirm({
            title: "Do you want to save your draft?",
            content: "Your progress will be lost if you leave now.",
            okText: "Yes, Save Draft",
            cancelText: "No, Leave Anyway",
            onOk: () => {
                onSave();
                warnedRef.current = false;
                window.location.reload(); // or use history.go(-1), etc
            },
            onCancel: () => {
                warnedRef.current = false;
                window.location.reload(); // or allow navigation
            },
        });
    };

    useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if ((e.key === "F5" || (e.ctrlKey && e.key === "r")) && shouldWarn) {
                e.preventDefault();
                showExitModal(e);
            }
        };

        const popstateHandler = (e: PopStateEvent) => {
            showExitModal(e);
        };

        const visibilityChangeHandler = () => {
            if (document.visibilityState === "hidden") {
                showExitModal();
            }
        };

        window.addEventListener("keydown", keydownHandler);
        window.addEventListener("popstate", popstateHandler);
        document.addEventListener("visibilitychange", visibilityChangeHandler);

        // Optional: fallback for browser refresh/tab close (will show native)
        window.onbeforeunload = (e) => {
            if (shouldWarn) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        return () => {
            window.removeEventListener("keydown", keydownHandler);
            window.removeEventListener("popstate", popstateHandler);
            document.removeEventListener("visibilitychange", visibilityChangeHandler);
        };
    }, [shouldWarn]);
};
