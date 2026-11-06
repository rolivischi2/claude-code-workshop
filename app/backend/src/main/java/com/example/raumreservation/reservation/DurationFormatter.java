package com.example.raumreservation.reservation;
import java.time.Duration;

/** Formats durations for error messages, e.g. "4 h" or "1 h 30 min". */
public final class DurationFormatter
{
    private DurationFormatter(){}

    public static String format( Duration duration ){
        long hours=duration.toHours();
        long minutes = duration.toMinutesPart();
        if(minutes==0){ return hours+" h"; }
        if (hours==0)
            return minutes + " min";
        return hours+" h "+minutes+" min";
    }
}
