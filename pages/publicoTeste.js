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
import { fileTypes } from "../utils/constants";
import { storage } from "../utils/firebase";
import PropostaOeMPersonalizada from "../components/utils/PropostaOeMPersonalizada";
function Teste() {
  const planOption = 1;
  return <PropostaOeMPersonalizada />;
}

export default Teste;
