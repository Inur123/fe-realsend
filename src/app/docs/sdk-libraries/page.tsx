import type { Metadata } from "next";
import SdkLibrariesClient from "./SdkLibrariesClient";

export const metadata: Metadata = {
  title: "SDK & Libraries - RealSend Documentation",
  description: "Integrasikan pengiriman email ke dalam kode Anda menggunakan SDK dan request REST API RealSend.",
};

export default function SdkLibrariesPage() {
  return <SdkLibrariesClient />;
}
