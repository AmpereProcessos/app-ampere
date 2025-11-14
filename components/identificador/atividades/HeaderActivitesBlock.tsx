import React, { useState } from "react";
import type { TAuthSession } from "@/lib/authentication/types";

import HeaderActivitiesModal from "./HeaderActivitiesModal";
import { useResponsibleActivities } from "@/utils/methods/query/activities";
import { Button } from "@/components/ui/button";
import { CheckboxIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type HeaderActivitesBlockProps = {
	session: TAuthSession;
};
function HeaderActivitesBlock({ session }: HeaderActivitesBlockProps) {
	const [activitiesModalIsOpen, setActivitiesModalIsOpen] = useState<boolean>(false);
	const { data: activities, filters, setFilters } = useResponsibleActivities({ id: session.user.id });

	const openActivitiesCount = activities ? activities.filter((a) => !a.dataConclusao).length : 0;
	return (
		<div className="relative hidden items-center lg:flex">
			<Button variant="ghost" onClick={() => setActivitiesModalIsOpen(true)} size={"fit"} className={cn("p-2", openActivitiesCount && "text-red-500")}>
				<CheckboxIcon className="text-primary h-4 w-4 lg:h-5 lg:w-5" />
			</Button>
			{openActivitiesCount > 0 ? (
				<div className="absolute -top-2 -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-1">
					<p className="text-xxs text-primary-foreground font-medium">{openActivitiesCount}</p>
				</div>
			) : null}
			{activitiesModalIsOpen ? (
				<HeaderActivitiesModal
					closeModal={() => setActivitiesModalIsOpen(false)}
					userId={session.user.id}
					activities={activities || []}
					filters={filters}
					setFilters={setFilters}
				/>
			) : null}
		</div>
	);
}

export default HeaderActivitesBlock;
