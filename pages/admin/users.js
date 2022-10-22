import { TiDelete } from "react-icons/ti";
import { RiAddCircleFill } from "react-icons/ri";
import { AiFillEyeInvisible } from "react-icons/ai";
import RoutesCard from "../../components/RoutesCard";
import { acessAuth, routes } from "../../utils/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
let positions = Object.keys(acessAuth);
export default function UsersControl({ credentials, setCredentials }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [userPosition, setUserPosition] = useState();
  const [userAcessibleRoutes, setUserRoutes] = useState();
  const [additionalRoutes, setAdditionalRoutes] = useState();
  const [userIsAdmin, setUserIsAdmin] = useState("N");
  const [message, setMessage] = useState("");
  const [passwordInputType, setPasswordInputType] = useState(false);
  function resetStates() {
    setName("");
    setLogin("");
    setPassword("");
    setUserPosition(positions[0]);
    setUserRoutes(acessAuth[positions[0]].accessibleRoutes);
    setAdditionalRoutes(undefined);
    setUserIsAdmin("N");
  }
  function checkInputs() {
    try {
      if (name.trim().length == 0) {
        setMessage("Nome não válido.");
        throw false;
      } else if (login.trim().length == 0) {
        setMessage("Login não válido.");
        throw false;
      } else if (password.trim().length == 0) {
        setMessage("Senha não válida.");
        throw false;
      } else {
        throw true;
      }
    } catch (result) {
      return result;
    }
  }
  function handleUserCreation() {
    if (checkInputs()) {
      let obj = {
        nome: name,
        email: login,
        password: password,
        accessibleRoutes: userAcessibleRoutes,
        admin: userIsAdmin == "N" ? false : true,
      };
      axios.post("/api/auth/user", obj).then((res) => {
        setMessage(res.data);
        resetStates();
      });
    }
  }
  //handling events
  function handlePositionChange(value) {
    setUserPosition(value);
    setUserRoutes(acessAuth[value].accessibleRoutes);
  }
  function removeRoute(index) {
    let arr = userAcessibleRoutes;
    arr.splice(index, 1);
    setUserRoutes([...arr]);
  }
  function addRoute(index, route) {
    let arr = userAcessibleRoutes;
    arr.push(route);
    setUserRoutes([...arr]);
  }
  // renders and re-render definers
  useEffect(() => {
    setUserPosition(positions[0]);
    setUserRoutes(acessAuth[positions[0]].accessibleRoutes);
  }, []);
  useEffect(() => {
    if (userAcessibleRoutes != undefined) {
      let diff = routes.filter((x) => !userAcessibleRoutes.includes(x));
      setAdditionalRoutes([...diff]);
    }
  }, [userAcessibleRoutes]);

  {
    /*console.log(userAcessibleRoutes);
  console.log("add", additionalRoutes);
  console.log("position", acessAuth[userPosition]);
  console.log({
    nome: name,
    login: login,
    password: password,
    accessibleRoutes: userAcessibleRoutes,
    admin: userIsAdmin == "N" ? false : true,
  });*/
  }
  console.log(credentials);
  return (
    <div className="p-6 grow bg-[#15599a]">
      <div className="grid px-24 grid-cols-3 grid-rows-2 mt-20 gap-x-4">
        <h1 className="text-center text-lg text-white font-bold uppercase col-span-3">
          Informações para autenticação
        </h1>
        <div className="flex gap-y-2 items-center flex-col">
          <span className="text-white font-bold uppercase">
            Nome do colaborador
          </span>
          <input
            value={name}
            type={"text"}
            className="outline-none px-4 text-gray-600 py-1 w-2/3 rounded"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex gap-y-2 items-center flex-col">
          <span className="text-white font-bold uppercase">Login</span>
          <input
            value={login}
            type={"text"}
            className="outline-none px-4 text-gray-600 py-1 w-2/3 rounded"
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div className="flex gap-y-2 items-center flex-col">
          <span className="text-white font-bold uppercase">Senha</span>
          <div className="flex bg-[#fff] items-center px-2 w-2/3 rounded">
            <input
              value={password}
              type={passwordInputType ? "text" : "password"}
              className="outline-none grow bg-transparent px-4 text-gray-600 py-1 w-2/3 rounded"
              onChange={(e) => setPassword(e.target.value)}
            />
            <AiFillEyeInvisible
              onClick={() => setPasswordInputType(!passwordInputType)}
              style={{ color: "gray", cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
      {message && (
        <div
          className={`text-center my-2 font-bold ${
            message == "Usuário criado" ? "text-green-500" : "text-red-400"
          }`}
        >
          {message}
        </div>
      )}
      <div className="grid grid-cols-5 mt-4 px-12">
        <div className="flex flex-col col-span-1">
          <span className="font-bold pb-4 text-white uppercase">Posição</span>
          <select
            defaultValue={userPosition}
            id="underline_select"
            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
            onChange={(e) => handlePositionChange(e.target.value)}
          >
            {positions.map((position) => (
              <option
                key={position}
                value={position}
                className="pl-4 ml-4 text-black"
              >
                {acessAuth[position].label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col px-12 col-span-4">
          <span className="text-center pb-4 font-bold text-white uppercase">
            Acessos
          </span>
          <div className="flex justify-around gap-3 flex-wrap">
            <RoutesCard
              icon={<TiDelete style={{ color: "#e63946" }} />}
              routes={userAcessibleRoutes}
              changeRoutes={removeRoute}
            />
          </div>
        </div>
      </div>
      <div
        className={
          userPosition && acessAuth[userPosition].tiers
            ? "grid grid-cols-5 mt-10 px-12"
            : "grid grid-cols-4 mt-10 px-12"
        }
      >
        {userPosition && acessAuth[userPosition].tiers && (
          <div className="flex flex-col col-span-1">
            <span className="font-bold mb-4 text-white uppercase">
              Permissão de administrador
            </span>
            <select
              defaultValue={userIsAdmin}
              onChange={(e) => setUserIsAdmin(e.target.value)}
              className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="N">Não</option>
              <option value="Y">Sim</option>
            </select>
          </div>
        )}
        <div className="flex flex-col px-12 col-span-4">
          <span className="font-bold text-center pb-4 text-white uppercase">
            Acessos adicionais
          </span>
          <div className="flex justify-around gap-3 flex-wrap">
            <RoutesCard
              icon={<RiAddCircleFill style={{ color: "#06d6a0" }} />}
              routes={additionalRoutes}
              changeRoutes={addRoute}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full mt-5 justify-center">
        <button
          onClick={handleUserCreation}
          className="bg-green-400 rounded p-2 text-white"
        >
          Criar novo usuário
        </button>
      </div>
    </div>
  );
}
