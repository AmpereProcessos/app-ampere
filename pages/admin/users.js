import { useEffect, useState, useContext } from "react";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import axios from "axios";
import { useRouter } from "next/router";
import ModalNovoUsuario from "../../components/ModalNovoUsuario";
import { AppContext } from "../../context/AppContext";
export default function UsersControl() {
  const router = useRouter();
  const { credentials } = useContext(AppContext);
  const [users, setUsers] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  useEffect(() => {
    if (credentials.manager) {
      axios.get("/api/auth/getUsers").then((res) => setUsers(res.data));
    } else {
      router.push("/");
    }
  }, []);
  return (
    <div className="p-6 grow bg-[#fff]">
      {/* <div className="flex flex-col">
        <h1 className="text-center text-[#15599a] font-bold">
          CRIAÇÃO DE USUÁRIOS
        </h1>
      </div>
      <div className="grid px-24 grid-cols-3 grid-rows-2 mt-20 gap-x-4">
        <h1 className="text-center text-lg text-[#15599a] font-bold uppercase col-span-3">
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
        <div className="flex flex-col col-span-1 gap-2">
          <div className="flex flex-col">
            <span className="font-bold pb-4 text-white uppercase">Posição</span>
            <select
              defaultValue={userPosition}
              id="underline_select"
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
              onChange={(e) => handlePositionChange(e.target.value)}
            >
              {positions.map((position, index) => (
                <option
                  key={index}
                  value={position}
                  className="pl-4 ml-4 text-black"
                >
                  {acessAuth[position].label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <span className="font-bold pb-4 text-white uppercase">
              VISUALIZAÇÃO
            </span>
            <select
              value={options.visualizacao}
              id="underline_select"
              className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
              onChange={(e) =>
                setOptions({ ...options, visualizacao: e.target.value })
              }
            >
              <option value={undefined} className="pl-4 ml-4 text-black">
                NORMAL
              </option>
              <option value={"REGIONAL"} className="pl-4 ml-4 text-black">
                REGIONAL
              </option>
              <option value={"VENDEDOR"} className="pl-4 ml-4 text-black">
                VENDEDOR
              </option>
            </select>
          </div>
          {options.visualizacao == "VENDEDOR" && (
            <div className="flex flex-col">
              <span className="font-bold pb-4 text-white uppercase">
                NOME DO VENDEDOR
              </span>
              <select
                value={options.vendedor}
                id="underline_select"
                className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                onChange={(e) =>
                  setOptions({ ...options, vendedor: e.target.value })
                }
              >
                {vendedores.map((vendedor, index) => (
                  <option
                    key={index}
                    value={vendedor.nome}
                    className="pl-4 ml-4 text-black"
                  >
                    {vendedor.nome}
                  </option>
                ))}
              </select>
            </div>
          )}
          {options.visualizacao == "REGIONAL" && (
            <div className="flex flex-col">
              <span className="font-bold pb-4 text-white uppercase">
                REGIONAL
              </span>
              <select
                value={options.regional}
                id="underline_select"
                className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                onChange={(e) =>
                  setOptions({ ...options, regional: e.target.value })
                }
              >
                {regionais.map((regional, index) => (
                  <option
                    key={index}
                    value={regional}
                    className="pl-4 ml-4 text-black"
                  >
                    {regional}
                  </option>
                ))}
                <option value={"NÃO DEFINIDO"} className="pl-4 ml-4 text-black">
                  {"NÃO DEFINIDO"}
                </option>
              </select>
            </div>
          )}
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
      </div> */}
      <div className="flex flex-col pb-2 border-b border-gray-200">
        <h1 className="text-center text-[#15599a] font-bold text-xl">
          CONTROLE DE USUÁRIOS
        </h1>
      </div>
      <div className="flex flex-col w-full border border-gray-200">
        {users?.length > 0 ? (
          <>
            <div className="grid grid-cols-5">
              <h1 className="p-2 bg-[#15599a] text-center text-white font-bold border-r border-white">
                NOME
              </h1>
              <h1 className="p-2 bg-[#15599a] text-center text-white font-bold border-r border-white">
                EMAIL
              </h1>
              <h1 className="p-2 bg-[#15599a] text-center text-white font-bold border-r border-white">
                MANAGER
              </h1>
              <h1 className="p-2 bg-[#15599a] text-center text-white font-bold border-r border-white">
                CONTROLLER
              </h1>
              <h1 className="p-2 bg-[#15599a] text-center text-white font-bold">
                ROTAS
              </h1>
            </div>
            <>
              {users.map((user) => (
                <div className="grid grid-cols-5 h-[100px]">
                  <div className="flex items-center uppercase font-bold justify-center text-center py-1 text-xs text-gray-600 border-b border-r border-gray-200">
                    {user.nome}
                  </div>
                  <div className="flex items-center justify-center text-center py-1 text-xs text-gray-600 border-b border-r border-gray-200">
                    {user.email}
                  </div>
                  <div className="flex items-center justify-center text-center py-1 text-xs text-gray-600 border-b border-r border-gray-200">
                    {user.manager ? (
                      <BsCheckCircleFill
                        style={{ color: "green", fontSize: "25px" }}
                      />
                    ) : (
                      <BsXCircleFill
                        style={{ color: "red", fontSize: "25px" }}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-center text-center py-1 text-xs text-gray-600 border-b border-r border-gray-200">
                    {user.controller ? (
                      <BsCheckCircleFill
                        style={{ color: "green", fontSize: "25px" }}
                      />
                    ) : (
                      <BsXCircleFill
                        style={{ color: "red", fontSize: "25px" }}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 px-2 items-center text-center py-1 overflow-y-auto overscroll-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 text-xs text-gray-600 border-b border-r border-gray-200 uppercase">
                    {user.accessibleRoutes?.map((i) => (
                      <p className="rounded bg-[#15599a] text-white p-1 font-bold text-xs">
                        {i}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </>
          </>
        ) : (
          <div className="w-full flex items-center justify-center p-2">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        <div
          onClick={() => setModalIsOpen(true)}
          className="fixed bg-[#15599a] cursor-pointer hover:bg-[#fead61] text-white hover:text-[#15599a] p-3 rounded-lg bottom-10 left-150"
        >
          <p className="uppercase font-bold text-sm">NOVO USUÁRIO</p>
        </div>
        {modalIsOpen && (
          <ModalNovoUsuario closeModal={() => setModalIsOpen(false)} />
        )}
      </div>
    </div>
  );
}
