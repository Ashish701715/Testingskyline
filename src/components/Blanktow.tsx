import React from 'react';
import { Card, Skeleton } from '@nextui-org/react';

export default function App({ number }: any) {
    const array: any = [];
    for (let i = 0; i < number; i++) {
        array.push(i);
    }
    return (
        <>
            {array.map((value: any, index: any) => (
                <Card key={index} className="w-ful space-y-5 p-4 h-[250px] mb-3" radius="lg">
                    <Skeleton className="rounded-lg w-20">
                        <div className="h-20 w-12 rounded-lg bg-default-300"></div>
                    </Skeleton>
                    <div className="space-y-3">
                        <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                        </Skeleton>
                        <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-full rounded-md h-[30px]">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-full rounded-md h-[30px]">
                            <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                    </div>
                </Card>
            ))}
        </>
    );
}
