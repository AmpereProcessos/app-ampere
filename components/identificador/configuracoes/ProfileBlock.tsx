import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ErrorComponent from "@/components/utils/ErrorComponent";
import type { TAuthSession } from "@/lib/authentication/types";
import {
  formatDateAsLocale,
  formatDateBirthdayAsLocale,
  formatNameAsInitials,
} from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useProfile } from "@/utils/methods/query/users";
import { Cake, IdCard, Mail, Phone, UserRound } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import EditProfile from "../usuarios/EditProfile";

type ProfileBlockProps = {
  session: TAuthSession;
};
export default function ProfileBlock({ session }: ProfileBlockProps) {
  const [editProfileModalIsOpen, setEditProfileModalIsOpen] = useState(false);
  const { data: profile, isLoading, isError, error, isSuccess } = useProfile();
  return (
    <div className="flex h-full grow flex-col">
      <div className="border-border flex w-full flex-col items-center justify-between border-b pb-2 lg:flex-row">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold">Meu Perfil</h1>
          <p className="text-sm text-foreground">Gerencie suas informações pessoais</p>
        </div>
        <Button onClick={() => setEditProfileModalIsOpen(true)} type="button">
          EDITAR PERFIL
        </Button>
      </div>
      {isLoading ? (
        <h3 className="text-sm text-foreground animate-pulse">Carregando perfil...</h3>
      ) : null}
      {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
      {isSuccess ? (
        <div className="flex w-full flex-col gap-2 py-2">
          <div className="w-full flex items-start gap-2">
            <div className="flex items-center justify-center">
              <Avatar className="w-20 h-20 min-w-20 min-h-20">
                <AvatarImage src={profile.avatar_url ?? undefined} alt="Avatar" />
                <AvatarFallback>{formatNameAsInitials(profile.nome ?? "")}</AvatarFallback>
              </Avatar>
            </div>
            <div className="grow flex flex-col gap-1 py-2">
              <h2 className="text-lg font-bold tracking-tight">{profile.usuario}</h2>
              <div className="flex items-center gap-x-3 gap-y-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <UserRound className="w-4 h-4 min-w-4 min-h-4" />
                  <p className="text-sm">{profile.nome ?? "NÃO DEFINIDO"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4 min-w-4 min-h-4" />
                  <p className="text-sm">{profile.email ?? "NÃO DEFINIDO"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4 min-w-4 min-h-4" />
                  <p className="text-sm">{profile.telefone ?? "NÃO DEFINIDO"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <IdCard className="w-4 h-4 min-w-4 min-h-4" />
                  <p className="text-sm">{profile.cpf ?? "NÃO DEFINIDO"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Cake className="w-4 h-4 min-w-4 min-h-4" />
                  <p className="text-sm">
                    {profile.dataNascimento
                      ? formatDateBirthdayAsLocale(profile.dataNascimento)
                      : "NÃO DEFINIDO"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {editProfileModalIsOpen ? (
        <EditProfile session={session} closeModal={() => setEditProfileModalIsOpen(false)} />
      ) : null}
    </div>
  );
}
