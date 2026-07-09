import TextInput from "@/components/inputs/Text";
import ErrorComponent from "@/components/utils/ErrorComponent";
import LoadingPage from "@/components/utils/LoadingPage";
import { cn } from "@/lib/utils";
import { formatDateAsLocale } from "@/utils/methods/formatting";
import { getErrorMessage } from "@/utils/methods/handlers";
import { useClientsBirthdays } from "@/utils/methods/query/clients";
import { TBirthdayRecord } from "@/utils/schemas/stats";
import dayjs from "dayjs";
import { Cake, Phone } from "lucide-react";
import React from "react";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { FaBirthdayCake } from "react-icons/fa";

function ClientsBirthdays() {
  const {
    data: birthdays,
    isLoading,
    isError,
    isSuccess,
    error,
    filters,
    setFilters,
  } = useClientsBirthdays();

  return (
    <div className="bg-card border-border flex h-full min-h-fit w-full flex-col gap-3 rounded-xl border px-3 py-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h1 className="text-xs font-medium tracking-tight uppercase">ANIVERSARIANTES DO MÊS</h1>
        <div className="flex items-center gap-2">
          <Cake className="h-4 min-h-4 w-4 min-w-4" />
        </div>
      </div>
      <div className="flex w-full flex-1 items-center justify-center gap-4">
        {isLoading ? (
          <h3 className="text-muted-foreground animate-pulse">Carregando aniversariantes...</h3>
        ) : null}
        {isError ? <ErrorComponent msg={getErrorMessage(error)} /> : null}
        {isSuccess ? <ClientsBirthdaysContent birthdays={birthdays} /> : null}
      </div>
    </div>
  );
}

export default ClientsBirthdays;

function ClientsBirthdaysContent({ birthdays }: { birthdays: TBirthdayRecord[] }) {
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1;
  const todaysBirthdays = birthdays.filter((birthday) => {
    const birthDate = dayjs(birthday.dataNascimento).add(3, "hours");
    const birthdayDay = birthDate.date();
    const birthdayMonth = birthDate.month() + 1;
    const isBirthdayToday = birthdayDay === currentDay && birthdayMonth === currentMonth;
    if (isBirthdayToday) console.log("birthday", birthday);
    return isBirthdayToday;
  });

  const otherBirthdays = birthdays.filter((birthday) => {
    const birthDate = dayjs(birthday.dataNascimento).add(3, "hours");
    const birthdayDay = birthDate.date();
    const birthdayMonth = birthDate.month() + 1;
    const isBirthdayToday = birthdayDay === currentDay && birthdayMonth === currentMonth;
    return !isBirthdayToday;
  });
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <h2 className="text-primary w-full text-start text-[0.65rem] font-bold uppercase lg:text-xs">
        ANIVERSARIANTES DO DIA
      </h2>
      {todaysBirthdays?.map((birthday, index) => (
        <ClientsBirthdaysCard key={index} birthday={birthday} highlight />
      ))}
      <h2 className="text-primary w-full text-start text-[0.65rem] font-bold uppercase lg:text-xs">
        OUTROS
      </h2>
      {otherBirthdays?.map((birthday, index) => (
        <ClientsBirthdaysCard key={index} birthday={birthday} />
      ))}
    </div>
  );
}

function ClientsBirthdaysCard({
  birthday,
  highlight,
}: {
  birthday: TBirthdayRecord;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded p-2",
        highlight && "border border-[#15599a] dark:border-[#fead41]",
      )}
    >
      <div className="flex items-center gap-2">
        <h1 className="text-primary text-[0.65rem] font-semibold tracking-tight lg:text-xs">
          {birthday.nome}
        </h1>
        <div className="flex items-center gap-1">
          <Phone className="h-3 min-h-3 w-3 min-w-3" />
          <h1 className="text-primary text-[0.5rem] font-semibold tracking-tight lg:text-[0.65rem]">
            {birthday.telefone}
          </h1>
        </div>
      </div>

      <h1 className="text-primary text-[0.65rem] font-semibold tracking-tight lg:text-xs">
        {formatDateAsLocale(birthday.dataNascimento)}
      </h1>
    </div>
  );
}
