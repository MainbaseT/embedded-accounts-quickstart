"use client";

import React, { FormEvent } from "react";
import {
  useAccount,
  useLogout,
  useSendUserOperation,
  useSmartAccountClient,
  useUser,
} from "@alchemy/aa-alchemy/react";
import {
  chain,
  accountType,
  gasManagerConfig,
  accountClientOptions as opts,
} from "@/config";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Hex } from "viem";
import { OpStatus } from "./op-status";

export const ProfileCard = () => {
  const user = useUser();
  const { address } = useAccount({ type: accountType });
  const { logout } = useLogout();

  //#region sending-user-op
  const { client } = useSmartAccountClient({
    type: accountType,
    gasManagerConfig,
    opts,
  });
  const {
    sendUserOperation,
    sendUserOperationResult,
    isSendingUserOperation,
    error: isSendUserOperationError,
  } = useSendUserOperation({ client, waitForTxn: true });

  const send = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget);
    const target = formData.get("to") as Hex;
    const data = formData.get("data") as Hex;
    const value = formData.get("value") as string;
    sendUserOperation({
      uo: { target, data, value: value ? BigInt(value) : 0n },
    });
  };
  //#endregion sending-user-op

  return (
    <Card>
      <form className="flex flex-col gap-4" onSubmit={send}>
        <div className="text-center text-lg font-semibold">
          Send a Transaction!
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="font-bold">Address:</div>
            <div>{address}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-bold">Email:</div>
            <div>{user?.email}</div>
          </div>
          <p className="rounded-md bg-slate-100 p-2 text-center font-light dark:bg-slate-800">
            These default values will mint you 100{" "}
            <a
              href={`${chain.blockExplorers?.default.url}/address/0x7d29eaA4F8bc836746B63FAd5180069e824DE291`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-[#363FF9] hover:underline dark:text-[#b6b9f9]"
            >
              Minty token
            </a>
            ! 🎉
          </p>
          <div className="flex items-center gap-2">
            <label className="w-12">To:</label>
            <Input
              name="to"
              defaultValue="0x7d29eaA4F8bc836746B63FAd5180069e824DE291"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-12">Data:</label>
            <Input
              name="data"
              defaultValue="0xa0712d680000000000000000000000000000000000000000000000056bc75e2d63100000"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-12">Value:</label>
            <Input name="value" defaultValue="0" />
          </div>
        </div>
        <div className="my-2 flex flex-col gap-4">
          <Button type="submit" disabled={isSendingUserOperation}>
            Send Transaction
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => logout()}
            disabled={isSendingUserOperation}
          >
            Logout
          </Button>
        </div>
        <OpStatus
          sendUserOperationResult={sendUserOperationResult}
          isSendingUserOperation={isSendingUserOperation}
          isSendUserOperationError={isSendUserOperationError}
        />
      </form>
    </Card>
  );
};
