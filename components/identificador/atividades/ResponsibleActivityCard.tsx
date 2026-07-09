import Avatar from "@/components/utils/Avatar";
import { formatDateAsLocale, formatNameAsInitials } from "@/utils/methods/formatting";
import { updateActivity } from "@/utils/methods/mutation/activities";
import { useMutationWithFeedback } from "@/utils/methods/mutation/general-hook";
import { TActivityDTO } from "@/utils/schemas/activities";
import React from "react";
import { BsCalendar4Event, BsCalendarCheck, BsCalendarPlus, BsCheck } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
type ResponsibleActivityCardProps = {
  userId: string | null;
  activity: TActivityDTO;
};
function ResponsibleActivityCard({ userId, activity }: ResponsibleActivityCardProps) {
  const queryClient = useQueryClient();
  const { mutate: handleUpdateActivity } = useMutationWithFeedback({
    mutationKey: ["update-activity", activity._id],
    mutationFn: updateActivity,
    queryClient: queryClient,
    affectedQueryKey: ["activities-by-responsible", userId],
    callbackFn: () => console.log(),
  });
  return (
    <div className="border-border flex w-full flex-col rounded border p-3 shadow-xs">
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`border-primary flex h-[16px] w-[16px] cursor-pointer items-center justify-center rounded-full border`}
            onClick={() =>
              // @ts-ignore
              handleUpdateActivity({
                id: activity._id,
                changes: {
                  dataConclusao: activity.dataConclusao ? null : new Date().toISOString(),
                },
              })
            }
          >
            {activity.dataConclusao ? <BsCheck style={{ color: "black" }} /> : null}
          </div>
          <p
            className={"cursor-pointer text-sm leading-none font-medium"}
            onClick={() =>
              // @ts-ignore
              handleUpdateActivity({
                id: activity._id,
                changes: {
                  dataConclusao: activity.dataConclusao ? null : new Date().toISOString(),
                },
              })
            }
          >
            {activity.titulo}
          </p>
        </div>
      </div>
      <div className="mt-1 flex w-full items-center justify-end gap-2">
        {activity.dataVencimento ? (
          <div className="flex items-center gap-1 text-orange-500">
            <BsCalendar4Event color="rgb(249,115,22)" size={17} />
            <p className="text-foreground text-[0.6rem] font-medium">
              {formatDateAsLocale(activity.dataVencimento, true)}
            </p>
          </div>
        ) : null}
        {activity.dataConclusao ? (
          <div className="flex items-center gap-1">
            <BsCalendarCheck color="rgb(34,197,94)" />
            <p className="text-foreground text-[0.6rem] font-medium">
              {formatDateAsLocale(activity.dataConclusao, true)}
            </p>
          </div>
        ) : null}
      </div>
      {activity.projeto.id ? (
        <div className="mt-2 mb-1 flex w-full items-center justify-center gap-2 text-cyan-500">
          <MdDashboard color="rgb(6,182,212)" />
          <p className="text-xxs text-foreground font-medium">{activity.projeto.nome}</p>
        </div>
      ) : null}
      <h1 className="text-foreground bg-primary/20 mb-2 w-full rounded-md p-2 py-1 text-center text-xs font-medium">
        {activity.descricao}
      </h1>
      <div className="flex w-full items-center justify-end gap-2">
        <div className="flex items-center gap-1">
          <BsCalendarPlus />
          <h1 className="text-foreground mr-2 text-[0.6rem] font-medium tracking-tight">
            {formatDateAsLocale(activity.dataInsercao, true)}
          </h1>
          <Avatar
            width={20}
            height={20}
            url={activity.autor.avatar_url}
            fallback={formatNameAsInitials(activity.autor.nome)}
          />
          <h1 className="text-foreground text-[0.6rem] font-medium tracking-tight">
            {activity.autor.nome}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default ResponsibleActivityCard;
