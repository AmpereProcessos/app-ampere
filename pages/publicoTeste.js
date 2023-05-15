import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Assinatura from "../utils/assinatura.jpg";
import Logo from "../utils/whitelogo.png";
import { FiCheck } from "react-icons/fi";
import axios from "axios";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { fileTypes, formatDate } from "../utils/constants";
import { storage } from "../utils/firebase";
import PropostaOeMPersonalizada from "../components/utils/PropostaOeMPersonalizada";
import DateInput from "../components/DateInput";
import dayjs from "dayjs";
import DateFloatingInput from "../components/DateFloatingInput";
function Teste() {
  const [holder, setHolder] = useState();
  console.log(holder);
  return (
    <div className="w-[21cm] h-[29.7cm]  p-4 px-12">
      <h1 className="text-center font-bold text-xl mb-6">teste</h1>
      <DateFloatingInput
        label={"DATA"}
        editable={true}
        value={holder ? formatDate(holder) : new Date()}
        handleChange={(value) => setHolder(new Date(value).toISOString())}
      />
    </div>
  );
}

export default Teste;
