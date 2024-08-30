import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";
import logo from "../../../public/edunetwork.png";
export default function App() {
    return (
        <div className="flex justify-center" style={{ paddingTop: '10%' }}>
            <Card className="max-w-[700px] h-[350px]">
                <CardHeader className="flex gap-3">
                    <Image
                        alt="nextui logo"
                        height={70}
                        radius="sm"
                        src={logo}
                        width={130}
                    />
                    <div className="flex flex-col">
                        <p className="text-md font-black text-lg">Skyline Immigration Consultants</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <p className="font-bold antialiased hover:subpixel-antialiased">"Thank you for signing up! 🎉 We're thrilled to welcome you to our community. Your registration is now complete, and you're all set to explore everything our platform has to offer. If you have any questions or need assistance, feel free to reach out to our support team at any time. Once again, welcome aboard, and we look forward to serving you!"  </p>
                </CardBody>
                <Divider />
                <CardFooter>
                    <Link
                        isExternal
                        showAnchorIcon
                        href="/auth/agent/signin"
                    >
                        back login screen
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
