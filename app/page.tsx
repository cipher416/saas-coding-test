"use client";
import {useState} from "react";
import PriceHistoryChart from "@/components/PriceHistoryChart";

type PriceHistoryInputType = {
    customerId: number,
    productId: number
}

export default function Home() {
    const [customerId, setCustomerId] = useState<number>(0);
    const [productId, setProductId] = useState<number>(0);
    const [priceHistoryinput, setPriceHistoryInput] = useState<PriceHistoryInputType>({productId: 1, customerId:1})
  return (
    <div className="flex flex-col max-h-screen items-center justify-center min-h-screen min-w-screen">
        <div className='flex-row space-x-5'>
            <input type={"number"} placeholder={"Enter CustomerID"}
                   onChange={(event) => setCustomerId(Number(event.target.value))}/>
            <input type={"number"} placeholder={"Enter ProductID"}
                   onChange={(event) => setProductId(Number(event.target.value))}/>
            <button onClick={() => setPriceHistoryInput({customerId, productId})}>
                Get Data
            </button>
        </div>
        <div className="size-2/4">
            <PriceHistoryChart customerId={priceHistoryinput.customerId} productId={priceHistoryinput.productId}/>
        </div>
    </div>
  );
}
