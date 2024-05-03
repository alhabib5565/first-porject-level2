
export type TSchedule = {
    startTime: string;
    endTime: string;
};

export const haseConflict = (asignSchedule: TSchedule[], newSchedule: TSchedule) => {
    const newStartTime = new Date(`2024-04-01T${newSchedule.startTime}`)
    const newEndTime = new Date(`2024-04-01T${newSchedule.endTime}`)

    for (const schedule of asignSchedule) {
        const previousStartTime = new Date(`2024-04-01T${schedule.startTime}`)
        const previousEndTime = new Date(`2024-04-01T${schedule.endTime}`)

        if (newStartTime < previousEndTime && newEndTime > previousStartTime) {
            return true
        }
    }

    return false
}