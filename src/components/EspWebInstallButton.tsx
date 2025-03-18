import React, {useEffect, useRef} from "react";
import "esp-web-tools";

type EspWebInstallButtonProps = {
    manifest: string;
    buttonText?: string;
    installLabel?: string;
    hideProgress?: boolean;
};

const EspWebInstallButton = ({
                                 manifest,
                                 buttonText = "Connect",
                                 installLabel = "ESP Flash",
                                 hideProgress = false
                             }: EspWebInstallButtonProps) => {
    const elementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        // Pass the ref to your element like:
        // React.createElement("esp-web-install-button", { ...props, ref });
        const button = elementRef.current?.shadowRoot?.querySelector("button");
        if (button) {
            button.textContent = buttonText;
            button.style.margin = "8px";
            button.style.backgroundColor = "#155dfc";
        }
    }, [buttonText]);

    return React.createElement("esp-web-install-button", {
        manifest: manifest,
        "install-label": installLabel,
        "hide-progress": hideProgress,
        ref: elementRef
    });
};

export default EspWebInstallButton;