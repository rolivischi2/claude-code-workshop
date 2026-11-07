package com.example.transit.declaration;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/** Formats the time left until the Gestellungsfrist, e.g. "3 Tage", "1 Tag" or "abgelaufen". */
public final class FristFormatter
{
    private FristFormatter(){}

    public static String format( LocalDate today,LocalDate deadline ){
        long days=ChronoUnit.DAYS.between(today,deadline);
        if(days<0){ return "abgelaufen"; }
        if (days==1)
            return "1 Tag";
        return days+" Tage";
    }
}
