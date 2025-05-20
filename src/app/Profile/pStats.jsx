"use client"
import { useState } from "react";
import { usePathname } from "next/navigation";
import {useQueryContext} from "@/src/app/components/queryProvider";


import { Bar, BarChart, LabelList, XAxis } from "recharts"
import {

    ChartContainer,
    ChartTooltip,

} from "@/components/ui/chart"


import { Pie, PieChart } from "recharts"

import { Area, AreaChart, CartesianGrid } from "recharts"
import {
    Card,
    CardContent,

} from "@/components/ui/card"

const chartConfig2 = {
    releaseYear: {
        label: "ReleaseYear",
    },
    hours: {
        label: 'Hours',
    },
    chaptersRead: {
        label: 'Chapters Read'
    },
    count: {
        label: "Count",
        color: "hsl(var(--chart-1))",
    },
    meanScore: {
        label: "MeanScore",
        color: "hsl(var(--chart-2))",
    },

}



const chartConfig3 = {
    count: {
        label: "count",
    },

    score: {
        label: "score",
        color: "hsl(var(--chart-1))",
    },
    count: {
        label: "count",
        color: "hsl(var(--chart-2))",
    },
    status: {
        label: "Status"
    },
    hours: {
        label: "hours",
        color: "hsl(var(--chart-2))",
    },
    format: {
        label: "Format"
    }
}

const chartConfig = {
    score: {
        label: "score",
        color: "hsl(var(--chart-1))",
    },
    count: {
        label: "count",
        color: "hsl(var(--chart-2))",
    },
    hours: {
        label: "hours",
        color: "hsl(var(--chart-2))",
    },
}








const animeSwitch = [
    {
        name: "Titles Watched"
    },
    {
        name: "Hours Watched"
    }
]

const mangaSwitch = [
    {
        name: "Titles Read"
    },
    {
        name: "Chapters Read"
    }
]

export default function PAnimeListMain() {
    const {statsData, statsLoading} = useQueryContext();

    let pathname = usePathname() || "/";
    const type = pathname.includes("/Profile/Stats/Anime/") ? 'anime' : 'manga';

    const statistics = statsData?.User?.statistics || [];

    const rawData = statistics[type]; // Pobranie danych przed mapowaniem








    const [isON, setON] = useState(true);

    function isFunction() {
        setON(true)
        setON2(false)
    }

    const [isON2, setON2] = useState(false);

    function isFunction2() {
        setON2(true)
        setON(false)
    }


    const [isSwitch, setSwitch] = useState(true);

    function isFunctionSwitch() {
        setSwitch(true)
        setSwitch2(false)
        setSwitch3(false)
    }

    const [isSwitch2, setSwitch2] = useState(false);

    function isFunctionSwitch2() {
        setSwitch(false)
        setSwitch2(true)
        setSwitch3(false)
    }

    const [isSwitch3, setSwitch3] = useState(false);

    function isFunctionSwitch3() {
        setSwitch(false)
        setSwitch2(false)
        setSwitch3(true)
    }

    const [isSwitch4, setSwitch4] = useState("cos");

    function isFunctionSwitch4(switchId) {
        setSwitch4(switchId)
    }

    const [isSwitch5, setSwitch5] = useState("cosik");

    function isFunctionSwitch5(switchId) {
        setSwitch5(switchId)

    }








    if (statsLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-1 flex justify-center items-center">
                    <div className="rotating"><div className="rotating-text">
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠂⠠⣦⢶⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⠤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⡧⠯⠁⠘⣽⡿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡟⠠⢶⣶⣿⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡛⣩⣵⡂⠀⢐⡒⡆⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠨⣵⣻⣧⣽⣳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⢸⡿⣞⡿⣋⡄⠀⠀⢭⣑⢻⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡇⠀⠀⠔⠫⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣸⣾⣧⣶⠟⡋⣀⡀⠀⢀⣀⣯⢎⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣷⠀⠀⠠⢶⣶⣞⣻⢿⣾⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣈⣾⣫⣿⣽⣶⣯⣟⡶⠄⠀⠀⠲⠄⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡆⠀⣴⣓⠚⠛⣿⣿⣿⣾⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⡿⠟⠉⠁⠀⠀⠀⠂⡧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡀⠉⠉⠉⣳⣿⣶⣿⣿⣿⣿⣿⣿⣿⣷⡶⣴⣴⣶⡛⠛⠉⠉⠉⠉⠉⠀⢠⠛⠛⢿⣟⣯⣷⣾⣿⣿⣿⣿⣿⣿⣟⣛⣭⡴⠄⠀⠀⠀⠀⠈⠆⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡧⠀⠀⠈⢉⣉⣿⣿⣿⣿⣿⠿⣛⣿⡿⠀⠀⠀⠻⢿⣦⢀⣀⡀⠀⠀⣤⣇⣀⣼⡞⠈⠉⠉⠉⣀⠉⠛⠻⢿⣿⣿⣟⠓⣦⠔⠀⠀⠀⠀⠀⠨⡕⠅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣇⠀⣤⣬⣿⣿⠟⠛⠉⠁⠀⠘⣿⣿⠇⠀⠀⠑⠀⠘⠿⠟⠛⠙⠦⡞⠉⠛⠾⠃⠀⠀⠀⠀⠀⢿⣿⣧⠀⠀⠀⠈⠙⢷⣶⣼⡒⠓⠂⠀⢀⠀⠍⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣾⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠘⠿⠀⠀⣀⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠾⡿⠉⠀⠀⠀⠀⠀⠀⠙⠿⣿⣶⡄⠀⢸⡇⡆⠀⠐⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠏⠉⢀⣰⣷⡿⠷⣾⣶⣶⣤⣀⠀⠀⠀⠀⠹⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⠈⠀⠀⠀⠁⣀⣤⣶⣾⣽⣿⣷⣤⣄⠀⠉⠛⣧⣿⠽⡀⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡾⠥⠤⠴⣾⡿⠃⢠⣾⣿⡟⠉⠉⣻⡗⢄⠀⠀⠀⠈⠣⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠁⠀⠀⡴⡏⠎⢿⣿⠋⠐⢿⣿⣏⠈⢹⣦⠀⠀⠀⢹⡙⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⢏⠀⠀⠀⠀⢿⣇⠀⢸⣿⣿⣧⣀⣰⣿⡇⠀⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⡈⡇⠀⡀⢸⣦⣤⡀⣼⣿⢿⠀⠀⢀⠈⠁⠀⠣⣄⠘⣳⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠃⠀⠁⠄⡀⠀⠀⠛⠦⠌⠿⠿⢿⠿⠿⠋⣠⣾⣿⡀⢀⡤⠖⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⢸⣿⣄⡀⠈⠻⢿⢿⠿⡿⠁⣀⡸⠃⠀⠀⠀⣠⠀⠻⢮⢥⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠁⠀⠀⠀⠀⠀⠀⠃⠰⠠⢄⡀⠀⠀⠀⠀⠀⠀⠀⣨⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠿⣷⣜⠋⠉⠉⠉⠉⠓⠀⠐⠀⠈⠈⠄⠀⡄⠐⠈⠁⠁⠀⡁⠂⠁⠘⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠐⠒⠠⢀⠠⢺⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⣦⡀⠀⠄⠀⠤⠀⠀⠐⠀⠉⠀⠀⠀⠀⠀⠀⠀⠄⠀⠀⢀⢀⡑⠝⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡏⠀⣠⣤⣠⣀⡀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠀⠀⠀⠀⣀⣤⣤⣤⣦⣤⣤⣤⣤⣤⣤⣤⣤⣀⠀⠀⠀⠀⠙⠛⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠀⢰⣄⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀⢈⣭⣿⠷⠚⠛⠙⢹⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢿⣿⣿⣿⣿⣿⣽⣿⣻⣟⣿⣽⣻⣟⣿⡷⠀⠀⠀⠀⠀⠐⢡⢀⠀⠀⠀⠀⠀⢀⣶⣴⣦⣤⣤⣄⡀⠀⢀⣶⡧⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣧⠀⠀⠈⠁⠀⠀⠀⠀⢸⣿⡆⠀⠀⠶⠆⢾⠃⠀⠷⠀⠀⠀⠀⠀⠈⠉⠉⢿⣟⣿⣿⣽⣿⡾⣿⡅⠀⠀⠀⠀⠀⠀⠀⢠⡄⢠⢯⠐⣀⠀⢀⣀⡈⠉⠉⠙⠙⠛⠛⠳⢚⡾⣽⡋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⢀⡀⢠⣶⠀⣴⡄⠀⠀⠀⠀⠀⠀⠀⠙⢯⣿⣾⣿⣏⡿⠃⠀⠀⠀⠀⠀⠀⠀⠠⣄⠠⣠⣀⡀⡈⠉⠉⠀⠀⠀⠀⠀⠀⢀⣤⡖⣿⠁⠴⣾⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢧⠀⠀⠀⠀⠀⠀⠀⠀⠹⠃⠀⠀⠀⡀⠀⢀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠉⠐⠀⠀⠀⠀⢠⡴⠞⠋⠁⠀⠀⠀⣠⢂⣥⠡⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⣤⣤⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣧⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠀⠈⠈⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠤⢈⡋⠉⠁⠀⠀⠚⠄⠌⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠏⠡⢺⡿⠏⠀⠀⡠⠀⠀⠀⠀⠀⠀⠐⠒⠠⠤⠄⠠⠤⠤⠤⠴⠒⠚⠉⠉⠉⠉⠉⠉⠓⠲⠤⢤⣀⣀⡀⣀⠤⠒⡖⠊⠩⠉⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠀⠀⠁⢴⡃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠏⠀⠀⠼⣅⠀⠀⢩⢶⣿⣿⣿⣶⠶⠚⠀⠀⠀⠀⠀⠐⠤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⡄⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⡑⠘⡮⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠏⠀⠀⢠⠎⠁⠀⠀⠀⠈⠉⠁⠉⠉⠟⠋⠽⢴⣂⣥⣀⣀⣀⣈⡉⢒⡶⠦⣀⣀⣀⣠⣀⣀⣀⣤⣴⣶⠿⠛⠁⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢬⣿⣡⣗⡅⠤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡏⠀⠀⠀⠀⠀⢡⠔⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁⠉⠉⠉⠀⠀⠀⠉⠉⠉⡍⠉⠉⢉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⣹⣿⣿⣖⣹⠨⣏⡐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⠀⠀⠀⠀⢰⠃⠤⠊⢠⠴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⠀⠀⢸⠐⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⣄⣤⣄⣹⣿⠛⡓⠂⠀⠙⠀⢻⠬⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣤⠄⠀⠀⠀⠀⣴⠈⠛⢻⢛⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⠞⠀⠀⠀⠈⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⠀⠀⠀⠀⠀⠤⣄⣷⣬⣙⡛⠛⠉⠀⠀⠀⠀⣒⡰⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠃⢼⣿⡇⠀⠀⠀⠀⠈⠁⠀⠟⠉⢩⣭⢉⣠⢀⡤⠀⠀⠀⠀⠀⠀⠀⢀⣾⠇⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣔⢆⢸⡀⠀⢀⣰⣠⡿⠒⠂⠈⠀⠁⠀⠀⠀⢀⠈⢠⣳⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡄⠀⠿⢟⡿⣶⡀⠀⠀⠀⠀⠀⠀⠸⠋⠡⣰⢿⣧⣞⣡⣾⣀⣄⣤⡾⠋⠈⠀⠀⠀⠀⠀⠀⠀⠀⢳⡈⢿⣆⣠⣀⢠⢀⡀⢠⣬⣏⣳⣬⠿⠛⠃⠈⠉⠀⠀⠀⠀⠀⠀⠀⠀⡰⣟⣿⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⡀⠀⠈⣼⠥⣿⣧⣶⣾⣀⡀⠀⠀⠀⠀⠁⠘⠁⠐⠛⠁⠘⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⠀⠉⠉⠛⠿⠿⠟⢻⣿⠉⠛⠙⠒⠒⠀⠀⠀⠀⠀⠀⠀⠀⢈⣷⣾⣾⣧⣎⡯⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⡇⢰⣀⠀⢠⠿⣿⣿⣿⣼⣧⣾⢀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠐⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣝⠒⢶⣿⡿⢿⡏⠁⠼⠁⡋⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣷⡼⣿⣄⠀⠀⠀⢨⠿⢻⣿⣿⣧⣾⣷⣏⣡⢀⣠⣷⣖⣴⣶⣶⣾⠤⢀⣤⣴⡾⠁⠀⠀⠘⣿⡷⣦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⢰⣶⣀⠰⣿⣷⣾⠏⠉⠀⠸⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⢻⠿⠇⡀⠀⠀⠀⠘⠈⠁⠀⡽⠛⠟⠋⣵⣾⡿⠿⠛⡿⠋⠁⡰⢫⢯⢿⠁⠀⠀⠀⠀⠘⠳⣽⣿⣦⢀⣞⣤⡀⠹⣤⣦⠀⡀⢴⢠⠀⢳⣿⣭⣛⠻⠏⠉⠉⠀⠀⠀⡨⢸⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣟⣾⣿⣷⣿⣧⡄⠀⠀⠀⠀⠀⠀⠀⠀⠒⠚⠉⠀⠀⠈⠀⠀⠊⠀⠀⠉⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠻⣿⢿⡿⣿⡦⣼⣿⡳⣽⣽⣷⠷⢬⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⢀⡨⣠⠴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⢩⣯⣼⣿⣿⡿⠻⡜⣦⣠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠃⠀⠀⠀⠈⠙⠋⠉⠉⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⢀⠐⣤⣼⣿⢩⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡇⣾⣽⣿⣿⢟⣵⢿⡇⣻⡿⣇⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠲⣤⣀⠀⠀⠀⠀⠀⠀⠀⢠⣠⢤⡀⠀⠤⠀⠀⠐⠀⠐⡐⣤⣿⣂⣿⠿⣷⠿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣻⢿⣿⢯⣾⣿⣿⣷⣿⢗⡙⢃⣷⣾⠀⡆⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠇⠀⠑⠆⠀⠀⠀⠀⠲⠌⠉⠁⠁⠀⠀⢠⡀⢤⣐⣈⣿⣿⣿⣿⣿⣿⣿⠦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣳⢯⣿⣿⢏⣾⣿⣿⣿⣾⣼⡿⠁⡿⠏⢻⡸⣇⣶⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢤⣀⣀⣀⠀⣐⣶⣾⣹⣯⣷⣚⠿⣷⣿⣿⣿⣿⡟⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⣾⣿⣿⣿⣿⣿⣿⣿⣿⡟⣁⣼⠟⣐⣬⡷⣠⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢰⣤⣴⣶⣶⠾⣷⣦⣽⡿⢩⣌⠻⣿⣷⣯⣟⡿⣿⣿⣿⣿⣿⣿⠇⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡟⢀⣼⣿⣿⣿⣿⣿⣿⡿⣋⣴⠟⣡⣶⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠿⣿⣷⣹⣿⡷⣿⣦⣻⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⡿⡏⣯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢘⡇⠸⣿⢋⣿⠟⠋⢁⡿⢠⠛⠠⠌⠉⣿⡿⣿⣿⡿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣷⢿⣿⣿⣿⣿⡟⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢷⣧⣼⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
                    </div>
                    </div>
                </div>
            </div>
        );
    }



    const chartData = rawData?.scores?.map((item) => {


        return ({
            count: item.count,
            score: item.score,
            chaptersRead: item.chaptersRead,
            hours: Math.floor(item.minutesWatched / 60),
            meanScore: item.meanScore,

        })
    })

    const chartData2 = rawData?.lengths?.map((item) => {


        return ({
            count: item.count,
            chaptersRead: item.chaptersRead,
            hours: Math.floor(item.minutesWatched / 60),
            meanScore: item.meanScore,
            length: item.length ?? 'Unknown',

        })
    })

    let kolorek = '';


    const chartDataStats = rawData?.formats?.reduce((sum, item) => sum + item.count, 0)

    console.log(chartDataStats)

    const chartDataFormats = rawData?.formats?.map((item, index) => {




        if (index === 0) {
            kolorek = '#14B8A6';
        } else if (index === 1) {
            kolorek = '#2C3E50';
        } else if (index === 2) {
            kolorek = '#EF4444';
        } else if (index === 3) {
            kolorek = '#ED6F17';
        } else if (index == 4) {
            kolorek = '#6366F1';
        }

        const format = item.format;
        const formattedText = format.charAt(0).toUpperCase() + format.slice(1).toLowerCase();

        return ({
            count: item.count,
            chaptersRead: item.chaptersRead,
            hours: Math.floor(item.minutesWatched / 60),
            meanScore: item.meanScore,
            format: formattedText,
            percent: Math.floor((item.count * 100) / chartDataStats),
            fill: kolorek
        })
    });
    const chartDataStatuses = rawData?.statuses?.map((item, index) => {

        if (index === 0) {
            kolorek = '#14B8A6';
        } else if (index === 1) {
            kolorek = '#2C3E50';
        } else if (index === 2) {
            kolorek = '#EF4444';
        } else if (index === 3) {
            kolorek = '#ED6F17';
        } else if (index == 4) {
            kolorek = '#6366F1';
        }
        const status = item.status
        const formattedText = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

        return ({
            count: item.count,
            chaptersRead: item.chaptersRead,
            hours: Math.floor(item.minutesWatched / 60),
            meanScore: item.meanScore,
            status: formattedText,
            fill: kolorek
        })
    })

    const getCountryName = (code) => {
        return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
    };

    const chartDataCountries = rawData?.countries?.map((item, index) => {
        if (index === 0) {
            kolorek = '#14B8A6';
        } else if (index === 1) {
            kolorek = '#2C3E50';
        } else if (index === 2) {
            kolorek = '#EF4444';
        } else if (index === 3) {
            kolorek = '#ED6F17';
        } else if (index == 4) {
            kolorek = '#6366F1';
        }


        return ({
            count: item.count,
            chaptersRead: item.chaptersRead,
            hours: Math.floor(item.minutesWatched / 60),
            meanScore: item.meanScore,
            country: getCountryName(item.country),
            fill: kolorek
        })
    })

    const chartDataReleaseYear = rawData?.releaseYears?.map((item, index) => {

        if (index === 0) {
            kolorek = '#14B8A6';
        } else if (index === 1) {
            kolorek = '#2C3E50';
        } else if (index === 2) {
            kolorek = '#EF4444';
        } else if (index === 3) {
            kolorek = '#ED6F17';
        } else if (index == 4) {
            kolorek = '#6366F1';
        }


        return ({
            count: item.count,
            chaptersRead: item.chaptersRead,
            hours: Math.floor(item.minutesWatched / 60),
            meanScore: item.meanScore,
            releaseYear: item.releaseYear,
            fill: kolorek
        })
    }).sort((a, b) => a.releaseYear - b.releaseYear)

    const chartDataStartYear = rawData?.startYears?.map((item, index) => {

        if (index === 0) {
            kolorek = '#14B8A6';
        } else if (index === 1) {
            kolorek = '#2C3E50';
        } else if (index === 2) {
            kolorek = '#EF4444';
        } else if (index === 3) {
            kolorek = '#ED6F17';
        } else if (index == 4) {
            kolorek = '#6366F1';
        }


        return ({
            count: item.count,
            chaptersRead: item.chaptersRead,
            hours: Math.floor(item.minutesWatched / 60),
            meanScore: item.meanScore,
            startYear: item.startYear,
            fill: kolorek
        })
    })





    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { score, count, hours, meanScore, chaptersRead, length } = payload[0].payload;

            return (
                <div
                    className={
                        "padding border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl"
                    }
                >
                    <div className="grid gap-1.5 p-2">
                        <div className="flex flex-1 justify-between items-center pb-2">
                            <span className="text-muted-foreground ">{length ? 'Episodes:' : 'Score:'}</span>
                            <span className="text-foreground font-mono font-medium">{length ? length : score}</span>
                        </div>
                        <div className="flex flex-1 justify-between items-center">
                            <span className="text-muted-foreground">Count:</span>
                            <span className="text-foreground font-mono font-medium">{count}</span>
                        </div>
                        <div className="flex flex-1 justify-between items-center">
                            <span className="text-muted-foreground">{pathname.includes("/Profile/Stats/Anime/") ? 'Hours Watched:' : 'Chapters Read'}</span>
                            <span className="text-foreground font-mono font-medium">{pathname.includes("/Profile/Stats/Anime/") ? hours : chaptersRead}</span>
                        </div>

                        <div className="flex flex-1 justify-between items-center">
                            <span className="text-muted-foreground">Mean Score:</span>
                            <span className="text-foreground font-mono font-medium">{meanScore}</span>
                        </div>

                    </div>
                </div>
            );
        }
        return null;
    };


    const CustomTooltipPie = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { count, hours, meanScore, chaptersRead, format, status, country, releaseYear, startYear } = payload[0].payload;

            return (
                <div
                    className={
                        "padding border-border/50 bg-background grid min-w-[11rem]  items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl"
                    }
                >
                    <div className="grid gap-1.5 p-2">
                        <div className="flex flex-1 justify-between items-center pb-2">
                            <span className="text-muted-foreground ">{format ? 'Format:' : status ? 'Status:' : releaseYear ? 'Release Year:' : startYear ? 'Started:' : 'Country:'}</span>
                            <span className="text-foreground font-mono font-medium">{format ? format : status ? status : releaseYear ? releaseYear : startYear ? startYear : country}</span>
                        </div>
                        <div className="flex flex-1 justify-between items-center">
                            <span className="text-muted-foreground">Count:</span>
                            <span className="text-foreground font-mono font-medium">{count}</span>
                        </div>
                        <div className="flex flex-1 justify-between items-center">
                            <span className="text-muted-foreground">{pathname.includes("/Profile/Stats/Anime/") ? 'Hours Watched:' : 'Chapters Read'}</span>
                            <span className="text-foreground font-mono font-medium">{pathname.includes("/Profile/Stats/Anime/") ? hours : chaptersRead}</span>
                        </div>

                        <div className="flex flex-1 justify-between items-center">
                            <span className="text-muted-foreground">Mean Score:</span>
                            <span className="text-foreground font-mono font-medium">{meanScore}</span>
                        </div>



                    </div>
                </div>
            );
        }
        return null;
    };




    const mangaOption = [
        {
            name: "Total Manga",
            value: statistics?.manga?.count,
            icon: () => (
                <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="book" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"></path></svg>
            )

        },
        {
            name: "Chapters Read",
            value: statistics?.manga?.chaptersRead,
            icon: () => (
                <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bookmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"></path></svg>
            )
        },
        {
            name: "Volumes Read",
            value: statistics?.manga?.volumesRead,
            icon: () => (
                <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="book-open" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64 2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49 69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43 30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73 87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0 62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11 218.77 46.95 10.62 5.35 23.21-1.94 23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z"></path></svg>
            )
        },
        {
            name: "Mean Score",
            value: statistics?.manga?.meanScore,
            icon: () => (
                <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="percentage" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M109.25 173.25c24.99-24.99 24.99-65.52 0-90.51-24.99-24.99-65.52-24.99-90.51 0-24.99 24.99-24.99 65.52 0 90.51 25 25 65.52 25 90.51 0zm256 165.49c-24.99-24.99-65.52-24.99-90.51 0-24.99 24.99-24.99 65.52 0 90.51 24.99 24.99 65.52 24.99 90.51 0 25-24.99 25-65.51 0-90.51zm-1.94-231.43l-22.62-22.62c-12.5-12.5-32.76-12.5-45.25 0L20.69 359.44c-12.5 12.5-12.5 32.76 0 45.25l22.62 22.62c12.5 12.5 32.76 12.5 45.25 0l274.75-274.75c12.5-12.49 12.5-32.75 0-45.25z"></path></svg>
            )
        },
        {
            name: "Standard  Devitation",
            value: statistics?.manga?.standardDeviation,
            icon: () => (
                <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="divide" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M224 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm0-192c35.35 0 64-28.65 64-64s-28.65-64-64-64-64 28.65-64 64 28.65 64 64 64zm192 48H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
            )
        }
    ]

    const animeOption = [
        {
            name: "Total Anime",
            value: statistics?.anime?.count,
            icon: () => (
                <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tv" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M592 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h245.1v32h-160c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-160v-32H592c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-16 352H64V64h512v288z"></path></svg>
            )
        },
        {
            name: "Episodes Watched",
            value: statistics?.anime?.episodesWatched,
            icon: () => (
                <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>
            )
        },
        {
            name: "Days Watched",
            value: (statistics?.anime?.minutesWatched / 60 / 24).toFixed(1),
            icon: () => (
                <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path></svg>
            )
        },

        {
            name: "Mean Score",
            value: statistics?.anime?.meanScore,
            icon: () => (
                <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="percentage" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M109.25 173.25c24.99-24.99 24.99-65.52 0-90.51-24.99-24.99-65.52-24.99-90.51 0-24.99 24.99-24.99 65.52 0 90.51 25 25 65.52 25 90.51 0zm256 165.49c-24.99-24.99-65.52-24.99-90.51 0-24.99 24.99-24.99 65.52 0 90.51 24.99 24.99 65.52 24.99 90.51 0 25-24.99 25-65.51 0-90.51zm-1.94-231.43l-22.62-22.62c-12.5-12.5-32.76-12.5-45.25 0L20.69 359.44c-12.5 12.5-12.5 32.76 0 45.25l22.62 22.62c12.5 12.5 32.76 12.5 45.25 0l274.75-274.75c12.5-12.49 12.5-32.75 0-45.25z"></path></svg>
            )
        },
        {
            name: "Standard Devitation",
            value: statistics?.anime?.standardDeviation,
            icon: () => (
                <svg data-v-72dc5b51="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="divide" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="iconStats"><path data-v-72dc5b51="" fill="currentColor" d="M224 352c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64zm0-192c35.35 0 64-28.65 64-64s-28.65-64-64-64-64 28.65-64 64 28.65 64 64 64zm192 48H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
            )
        }
    ]

    if (pathname === "/Profile/Stats") {
        pathname = "/Profile/Stats/Anime/Overview"
    }






    const statsH3Anime = [
        {
            name: "Episode Count"
        }
    ]

    const statsH3Manga = [
        {
            name: "Chapter Count"
        }
    ]

    const statsSwitchAnime = [
        {
            name: "Titles Watched"
        },
        {
            name: "Hours Watched"
        },
        {
            name: "Mean Score"
        }
    ]

    const statsSwitchManga = [
        {
            name: "Titles Read"
        },
        {
            name: "Chapters Read"
        },
        {
            name: "Mean Score"
        }
    ]

    const statsSwitchYear = [
        {
            name: "Watch Year"
        },
        {
            name: "Read Year"
        }
    ]










    return (


        <>


            <div className="StatsMainContainer">
                <div className="StatsMain">
                    <div className="statsMainGora">
                        {(pathname.includes("/Profile/Stats/Anime/") ? animeOption : mangaOption).map((item) => {

                            return (
                                <div key={item.name} className="statsMainTotal">
                                    <div className="circle">
                                        {item.icon()}

                                    </div>
                                    <div className="statsMainInfo">
                                        <span className="wynikStats">{item.value}</span>
                                        <p className="opisStats">{item.name}</p>
                                    </div>
                                </div>
                            )
                        })}

                    </div>

                    <div className="statsMainScore">
                        <div className="headerScore">
                            <h3>Score</h3>
                            <div className="scoreSwitch">
                                <div className={`optionScore ${isON ? "scoreActive" : ""}`} >
                                    <span onClick={() => isFunction()}>
                                        {(pathname.includes("/Profile/Stats/Anime/") ? animeSwitch[0] : mangaSwitch[0]).name}
                                    </span>
                                </div>

                                <div className={`optionScore ${isON2 ? "scoreActive" : ""}`}>
                                    <span onClick={() => isFunction2()}>
                                        {(pathname.includes("/Profile/Stats/Anime/") ? animeSwitch[1] : mangaSwitch[1]).name}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="statsBarContainer overflow-visible">
                        <ChartContainer config={chartConfig} className="h-[194px] w-full">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20 }}
                                radius={0}

                                barSize={40}

                            >

                                <XAxis
                                    dataKey="score"
                                    tickLine={false}
                                    tickMargin={5}
                                    axisLine={false}
                                    tick={{ fill: '#7C899A' }}
                                    fontSize={12}

                                >

                                </XAxis>
                                <ChartTooltip
                                    cursor={false}

                                    wrapperClassName="padding"
                                    content={<CustomTooltip />}
                                />
                                <Bar dataKey={pathname.includes("/Profile/Stats/Anime/") ? (isON ? 'count' : 'hours') : (isON ? 'count' : 'chaptersRead')} fill={'#14B8A6'} radius={8}>
                                    <LabelList
                                        position="top"
                                        offset={9}

                                        className="fill-[#7C899A]"
                                        fontSize={12}
                                    />
                                </Bar>

                            </BarChart>
                        </ChartContainer>
                    </div>
                    <div className="statsMainScore">
                        <div className="headerScore">
                            <h3 >{(pathname.includes("/Profile/Stats/Anime/") ? statsH3Anime[0] : statsH3Manga[0]).name}</h3>
                            <div className="scoreSwitch">
                                <div className={`optionScore ${isSwitch ? "scoreActive" : ""}`} >
                                    <span onClick={() => isFunctionSwitch()}>
                                        {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[0] : statsSwitchManga[0]).name}
                                    </span>
                                </div>

                                <div className={`optionScore ${isSwitch2 ? "scoreActive" : ""}`}>
                                    <span onClick={() => isFunctionSwitch2()}>
                                        {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[1] : statsSwitchManga[1]).name}
                                    </span>
                                </div>

                                <div className={`optionScore ${isSwitch3 ? "scoreActive" : ""}`}>
                                    <span onClick={() => isFunctionSwitch3()}>
                                        {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[2] : statsSwitchManga[2]).name}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>



                    <div className="statsBarContainer overflow-visible">
                        <ChartContainer config={chartConfig} className="h-[194px] w-full">
                            <BarChart
                                data={chartData2}
                                margin={{ top: 20 }}
                                radius={0}

                                barSize={40}

                            >

                                <XAxis
                                    dataKey="length"
                                    tickLine={false}
                                    tickMargin={5}
                                    axisLine={false}
                                    tick={{ fill: '#7C899A' }}
                                    fontSize={12}

                                >

                                </XAxis>
                                <ChartTooltip
                                    cursor={false}

                                    wrapperClassName="padding"
                                    content={<CustomTooltip />}
                                />
                                <Bar dataKey={pathname.includes("/Profile/Stats/Anime/") ? (isSwitch ? 'count' : isSwitch2 ? 'hours' : isSwitch3 ? 'meanScore' : '') : (isSwitch ? 'count' : isSwitch2 ? 'chaptersRead' : isSwitch3 ? 'meanScore' : '')} fill={'#14B8A6'} radius={8}>
                                    <LabelList
                                        position="top"
                                        offset={9}

                                        className="fill-[#7C899A]"
                                        fontSize={12}
                                    />
                                </Bar>

                            </BarChart>
                        </ChartContainer>
                    </div>




                    <div className="pie-charts">
                        <div className="pie-chart">
                            <div className="pieTitle">Format Distribution</div>
                            <div className="pieWrap">

                                <div className="pieImgContainer flex justify-center">



                                    <ChartContainer
                                        config={chartConfig3}
                                        className="mx-auto aspect-square h-[115px] max-h-[250px]"
                                    >
                                        <PieChart className="Pie">
                                            <ChartTooltip
                                                cursor={false}
                                                wrapperClassName="padding"
                                                content={<CustomTooltipPie />}
                                                position={{ x: -30, y: -125 }} // ✅ POPRAWNE

                                            />
                                            <Pie data={chartDataFormats} dataKey="count" nameKey="format" />
                                        </PieChart>
                                    </ChartContainer>



                                </div>

                                <div className="pieLabels">

                                    {rawData?.formats?.slice(0, 3).map((item, index) => {
                                        const percent = Math.floor((item.count * 100) / chartDataStats)
                                        let kolor = ''
                                        if (index === 0) {
                                            kolor = 'rgb(20, 184, 166)'
                                        } else if (index === 1) {
                                            kolor = '#2C3E50'
                                        } else if (index === 2) {
                                            kolor = '#ef4444'
                                        }

                                        return (
                                            <div key={index} className="pieLabelWrap" style={{
                                                backgroundColor: kolor
                                            }}>
                                                <div className="pieLabel">{item.format}</div>
                                                <div className="piePercent">{percent}%</div>
                                            </div>
                                        )
                                    })}


                                </div>

                            </div>
                        </div>

                        <div className="pie-chart">
                            <div className="pieTitle">Status Distribution</div>
                            <div className="pieWrap">

                                <div className="pieImgContainer flex justify-center">



                                    <ChartContainer
                                        config={chartConfig3}
                                        className="mx-auto aspect-square h-[115px] max-h-[250px]"
                                    >
                                        <PieChart className="Pie">
                                            <ChartTooltip
                                                cursor={false}
                                                wrapperClassName="padding"
                                                content={<CustomTooltipPie />}
                                                position={{ x: -30, y: -125 }} // ✅ POPRAWNE

                                            />
                                            <Pie data={chartDataStatuses} dataKey="count" nameKey="status" />
                                        </PieChart>
                                    </ChartContainer>



                                </div>

                                <div className="pieLabels">

                                    {rawData?.statuses?.slice(0, 3).map((item, index) => {
                                        const percent = Math.floor((item.count * 100) / chartDataStats)
                                        const status = item.status
                                        let kolor = ''
                                        if (index === 0) {
                                            kolor = 'rgb(20, 184, 166)'
                                        } else if (index === 1) {
                                            kolor = '#2C3E50'
                                        } else if (index === 2) {
                                            kolor = '#ef4444'
                                        }

                                        const formattedText = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()

                                        return (
                                            <div key={index} className="pieLabelWrap" style={{
                                                backgroundColor: kolor
                                            }}>
                                                <div className="pieLabel">{formattedText}</div>
                                                <div className="piePercent">{percent}%</div>
                                            </div>
                                        )
                                    })}


                                </div>

                            </div>
                        </div>

                        <div className="pie-chart">
                            <div className="pieTitle">Country Distribution</div>
                            <div className="pieWrap">

                                <div className="pieImgContainer flex justify-center">



                                    <ChartContainer
                                        config={chartConfig3}
                                        className="mx-auto aspect-square h-[115px] max-h-[250px]"
                                    >
                                        <PieChart className="Pie">
                                            <ChartTooltip
                                                cursor={false}
                                                wrapperClassName="padding"
                                                content={<CustomTooltipPie />}
                                                position={{ x: -30, y: -125 }} // ✅ POPRAWNE

                                            />
                                            <Pie data={chartDataCountries} dataKey="count" nameKey="country" />
                                        </PieChart>
                                    </ChartContainer>



                                </div>

                                <div className="pieLabels">

                                    {rawData?.countries?.slice(0, 3).map((item, index) => {
                                        const percent = Math.floor((item.count * 100) / chartDataStats)
                                        let kolor = ''
                                        if (index === 0) {
                                            kolor = 'rgb(20, 184, 166)'
                                        } else if (index === 1) {
                                            kolor = '#2C3E50'
                                        } else if (index === 2) {
                                            kolor = '#ef4444'
                                        }

                                        return (
                                            <div key={index} className="pieLabelWrap" style={{
                                                backgroundColor: kolor
                                            }}>
                                                <div className="pieLabel">{getCountryName(item.country)}</div>
                                                <div className="piePercent">{percent}%</div>
                                            </div>
                                        )
                                    })}


                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="statsMainScore">
                        <div className="headerScore">
                            <h3 >Release Year</h3>
                            <div className="scoreSwitch">
                                <div className={`optionScore ${isSwitch5 === "cosik" ? "scoreActive" : ""}`} >
                                    <span onClick={() => isFunctionSwitch5("cosik")}>
                                        {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[0] : statsSwitchManga[0]).name}
                                    </span>
                                </div>

                                <div className={`optionScore ${isSwitch5 === "cosik1" ? "scoreActive" : ""}`}>
                                    <span onClick={() => isFunctionSwitch5("cosik1")}>
                                        {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[1] : statsSwitchManga[1]).name}
                                    </span>
                                </div>

                                <div className={`optionScore ${isSwitch5 === "cosik2" ? "scoreActive" : ""}`}>
                                    <span onClick={() => isFunctionSwitch5("cosik2")}>
                                        {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[2] : statsSwitchManga[2]).name}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="statsBarContainer">
                        <Card className="chart media-score-distribution rounded-[4px] !border-none">

                            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                                <ChartContainer
                                    config={chartConfig2}
                                    className="aspect-auto h-[250px] w-full"
                                >
                                    <AreaChart data={chartDataReleaseYear}>
                                        <defs>

                                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor="#00BC80"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#00BC80"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>

                                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor="#B7D59E"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#B7D59E"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>






                                        </defs>
                                        <CartesianGrid className="gridColor" vertical={false} />
                                        <XAxis
                                            dataKey="releaseYear"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            className="labels"
                                            minTickGap={32}
                                            fontSize={9}

                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            wrapperClassName="padding"
                                            content={<CustomTooltipPie />}

                                        />




                                        <Area
                                            dataKey={`${pathname.includes("/Profile/Stats/Anime/") ? (isSwitch5 === "cosik" ? 'count' : isSwitch5 === "cosik1" ? 'hours' : isSwitch5 ? 'meanScore' : '') : (isSwitch5 === "cosik" ? 'count' : isSwitch5 === "cosik1" ? 'chaptersRead' : isSwitch5 ? 'meanScore' : '')}`}
                                            type="natural"
                                            fill="url(#fillMobile)"
                                            stroke="#00BC80"
                                            stackId="a"
                                        />





                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>



                    <div className="statsMainScore">
                        <div className="headerScore">
                            <h3 >{(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchYear[0] : statsSwitchYear[1]).name}</h3>
                            <div className="scoreSwitch">
                                <div className={`optionScore ${isSwitch4 === "cos" ? "scoreActive" : ""}`} >
                                    <span onClick={() => isFunctionSwitch4("cos")}>
                                        {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[0] : statsSwitchManga[0]).name}
                                    </span>
                                </div>

                                <div className={`optionScore ${isSwitch4 === "cos1" ? "scoreActive" : ""}`}>
                                    <span onClick={() => isFunctionSwitch4("cos1")}>
                                        {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[1] : statsSwitchManga[1]).name}
                                    </span>
                                </div>

                                <div className={`optionScore ${isSwitch4 === "cos2" ? "scoreActive" : ""}`}>
                                    <span onClick={() => isFunctionSwitch4("cos2")}>
                                        {(pathname.includes("/Profile/Stats/Anime/") ? statsSwitchAnime[2] : statsSwitchManga[2]).name}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="statsBarContainer">
                        <Card className="chart media-score-distribution rounded-[4px] !border-none">

                            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                                <ChartContainer
                                    config={chartConfig2}
                                    className="aspect-auto h-[250px] w-full"
                                >
                                    <AreaChart data={chartDataStartYear}>
                                        <defs>

                                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor="#00BC80"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#00BC80"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>

                                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                                <stop
                                                    offset="5%"
                                                    stopColor="#B7D59E"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#B7D59E"
                                                    stopOpacity={0.1}
                                                />
                                            </linearGradient>






                                        </defs>
                                        <CartesianGrid className="gridColor" vertical={false} />
                                        <XAxis
                                            dataKey="startYear"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            className="labels"
                                            minTickGap={32}
                                            fontSize={9}

                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            wrapperClassName="padding"
                                            content={<CustomTooltipPie />}

                                        />




                                        <Area
                                            dataKey={`${pathname.includes("/Profile/Stats/Anime/") ? (isSwitch4 === "cos" ? 'count' : isSwitch4 === "cos1" ? 'hours' : isSwitch4 === "cos2" ? 'meanScore' : '') : (isSwitch4 === "cos" ? 'count' : isSwitch4 === "cos1" ? 'chaptersRead' : isSwitch4 === "cos2" ? 'meanScore' : '')}`}
                                            type="natural"
                                            fill="url(#fillMobile)"
                                            stroke="#00BC80"
                                            stackId="a"
                                        />





                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>


                </div>


            </div>
        </>
    );
}
