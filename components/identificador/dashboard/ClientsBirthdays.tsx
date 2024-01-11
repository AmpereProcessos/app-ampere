import TextInput from '@/components/inputs/Text'
import ErrorComponent from '@/components/utils/ErrorComponent'
import LoadingPage from '@/components/utils/LoadingPage'
import { useClientsBirthdays } from '@/utils/methods/query/clients'
import React from 'react'
import { BsFillCalendarEventFill } from 'react-icons/bs'
import { FaBirthdayCake } from 'react-icons/fa'

function ClientsBirthdays() {
  const { data: birthdays, isLoading, isError, isSuccess, filters, setFilters } = useClientsBirthdays()
  return (
    <div className="mt-4 flex grow flex-col border  border-gray-200 bg-[#fff] p-4 shadow-xl">
      <div className="flex w-full flex-col items-center justify-between lg:flex-row">
        <h1 className="uppercase text-gray-600">ANIVERSARIANTES DO MÊS</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full lg:w-[250px]">
            <TextInput
              label="NOME"
              showLabel={false}
              placeholder="Pesquise pelo nome do contrato..."
              value={filters.name}
              handleChange={(value) => setFilters((prev) => ({ ...prev, name: value }))}
              width="100%"
            />
          </div>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, isToday: !prev.isToday }))}
            className={`${
              filters.isToday ? 'bg-[#fead41] text-white' : 'bg-transparent text-[#fead41]'
            } h-[49px] w-full rounded-md border border-[#fead41] p-2 font-bold lg:w-fit`}
          >
            ANIVERSARIANDO HOJE
          </button>
        </div>
      </div>
      <div className="mt-2 flex w-full grow flex-wrap justify-center gap-y-2 lg:justify-between">
        {isLoading ? <LoadingPage /> : null}
        {isError ? <ErrorComponent msg={'Erro ao carregar aniversariantes do mês.'} /> : null}
        {isSuccess
          ? birthdays.map((birthday, index) => (
              <div
                key={index}
                className="flex w-full flex-col gap-2 rounded-md border border-gray-200 bg-[#fff] p-3 text-center text-xs shadow-sm lg:w-[450px]"
              >
                <div className="flex w-full items-center justify-between">
                  <h1 className="font-bold leading-none tracking-tight">{birthday.nome}</h1>
                  {new Date(birthday.dataNascimento).getDate() == new Date().getDate() ? <FaBirthdayCake color="DA0C81" size={20} /> : null}
                </div>
                <div className="flex items-center justify-center gap-2 ">
                  <BsFillCalendarEventFill color="rgb(107,114,128)" />
                  <p className="font-bold text-[#DA0C81]">
                    {birthday.dataNascimento != undefined && new Date(birthday.dataNascimento).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  )
}

export default ClientsBirthdays
