import { useMemo, useState } from "react";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

import { DateSelect } from "@/shared/widgets/date-select";
import { TrackSelect } from "@/shared/widgets/track-select";

import { useGetAllDates } from "../projects-list-page/api/hooks/use-get-all-dates";
import { useGetAllTracks } from "@/shared/api/hooks/use-get-all-tracks";

import { lockTrack } from "./api/lock-track";
import { unlockTrack } from "./api/unlock-track";

export function AdminTrackAccess() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: dates, refetch: refetchDates } = useGetAllDates();
  const { data: tracks } = useGetAllTracks();

  const currentDate = useMemo(() => {
    return dates?.find((date) => date.name === selectedDate);
  }, [dates, selectedDate]);

  const currentTrack = useMemo(() => {
    return tracks?.find((track) => track.name === selectedTrack);
  }, [tracks, selectedTrack]);

  const isTrackClosed = useMemo(() => {
    if (!currentDate || !currentTrack) {
      return false;
    }

    return currentDate.closedTracksId?.includes(currentTrack.id);
  }, [currentDate, currentTrack]);

  const handleToggleTrack = async () => {
    if (!currentDate || !currentTrack) {
      return;
    }

    try {
      setIsLoading(true);

      if (isTrackClosed) {
        await unlockTrack(currentDate.id, currentTrack.id);
      } else {
        await lockTrack(currentDate.id, currentTrack.id);
      }

      await refetchDates();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Выбор даты и трека</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <DateSelect
              value={selectedDate}
              onValueChange={setSelectedDate}
            />

            <TrackSelect
              value={selectedTrack}
              onValueChange={setSelectedTrack}
            />
          </div>

          {currentDate && currentTrack && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span>Статус:</span>

                <Badge
                className={
                    isTrackClosed
                    ? ""
                    : "bg-green-700 hover:bg-green-800 text-white"
                }
                variant= "destructive"
                >
                {isTrackClosed ? "Закрыт" : "Открыт"}
                </Badge>
              </div>

            <Button
            disabled={isLoading}
            onClick={handleToggleTrack}
            variant="destructive"
            className={
                isTrackClosed
                ? "bg-green-700 hover:bg-green-800 text-white"
                : ""
            }
            >
            {isLoading
                ? "Сохранение..."
                : isTrackClosed
                ? "Открыть трек"
                : "Закрыть трек"}
            </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}