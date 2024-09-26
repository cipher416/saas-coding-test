"use client";
import {useState} from "react";
import PriceHistoryChart from "@/components/PriceHistoryChart";

export default function Home() {
    const [customerId, setCustomerId] = useState<number>(0);
    const [productId, setProductId] = useState<number>(0);
  return (
    <div className="">
        <div>
            <input type={"number"} placeholder={"Enter CustomerID"}
                   onChange={(event) => setCustomerId(Number(event.target.value))}/>
            <input type={"number"} placeholder={"Enter ProductID"}
                   onChange={(event) => setProductId(Number(event.target.value))}/>
        </div>

        <PriceHistoryChart customerId={customerId} productId={productId}/>
    </div>
  );
}
