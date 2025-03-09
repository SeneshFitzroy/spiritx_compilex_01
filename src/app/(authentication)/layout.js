import ReCaptcha from "../../components/ReCaptcha";

export default function Layout({ children }) {
    return (
        <ReCaptcha>
            {children}
        </ReCaptcha>
    );
}