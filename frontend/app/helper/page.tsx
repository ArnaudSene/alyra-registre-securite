'use client'

import { useState } from "react"
import {
    getCompanyAccountUpdatedEventsv2,
    getRegisterCreatedEvents, getVerificationTaskCreatedEvents, getVerificationTaskCreatedEventsv2,
    getVerificationTaskUpdatedEvents, getVerificationTaskValidatedEvents, getVerificationTaskValidatedEventsv2,
    getVerifierAccountUpdatedEvents,
    getVerifierAddedToCompanyEvents,
    getVerifierCreatedEvents,
} from "@/utils";
import {
    ICompanyAccountUpdated,
    IRegisterCreated,
    IVerificationTaskCreated, IVerificationTaskUpdated, IVerificationTaskValidated,
    IVerifierCreated
} from "@/interfaces/company";


const Helper = () => {
    const [eventsRegistersCreated, setEventsRegistersCreated ] = useState<IRegisterCreated[]>([])
    const [eventsCompanyAccountUpdated, setEventsCompanyAccountUpdated ] = useState<any[]>([])
    const [eventsVerifierCreated, setEventsVerifierCreated ] = useState<any[]>([])
    const [eventsVerifierAccountUpdated, setEventsVerifierAccountUpdated ] = useState<any[]>([])
    const [eventsVerifierAddedToCompany, setEventsVerifierAddedToCompany ] = useState<any[]>([])
    const [eventsVerificationTaskCreated, setEventsVerificationTaskCreated ] = useState<any[]>([])
    const [eventsVerificationTaskValidated, setEventsVerificationTaskValidated ] = useState<any[]>([])
    const [eventsVerificationTaskUpdated, setEventsVerificationTaskUpdated ] = useState<any[]>([])

    return (
        <div className="flex flex-col py-10">
            <div className="p-5">
                <button
                    onClick={() => getRegisterCreatedEvents().then(data => setEventsRegistersCreated(data))}
                    className="p-2 bg-slate-50 text-blue-600 border "
                >
                    getRegisterCreatedEvents
                </button>

                <div className="flex flex-col">
                    <div className="flex flex-row border border-slate-50  text-slate-50">
                        <div className="bg-rose-600 border-l w-5 px-1">#</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Account</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Name</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Adresse</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Siret</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Site</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Adresse site</div>
                    </div>
                    {eventsRegistersCreated?.map((e, index ) =>
                        <div className="flex flex-row border text-slate-50">
                            <div className="w-5 px-1">{index}</div>
                            <div className="w-40 border-l  px-1  ">{e.account} </div>
                            <div className="w-40 border-l  px-1  ">{e.name} </div>
                            <div className="w-40 border-l  px-1  ">{e.addressName} </div>
                            <div className="w-40 border-l  px-1  ">{e.siret} </div>
                            <div className="w-40 border-l  px-1  ">{e.siteName} </div>
                            <div className="w-40 border-l  px-1  ">{e.siteAddressName} </div>
                        </div>
                    )}
                </div>
            </div>


            <div className="p-5">
                <button
                    onClick={() => getCompanyAccountUpdatedEventsv2().then(data => setEventsCompanyAccountUpdated(data))}
                    className="p-2 bg-slate-50 text-blue-600 border "
                >
                    getCompanyAccountUpdatedEvents
                </button>

                <div className="flex flex-col">
                    <div className="flex flex-row border border-slate-50  text-slate-50">
                        <div className="bg-rose-600 border-l w-40 px-1">Index</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Account Company</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Member</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Action</div>
                    </div>
                    {eventsCompanyAccountUpdated?.map((e: ICompanyAccountUpdated, index ) =>
                        <div className="flex flex-row border text-slate-50">
                            <div className="w-40 px-1">{index}</div>
                            <div className="w-40 border-l px-1">{e.company} </div>
                            <div className="w-40 border-l px-1">{e.account} </div>
                            <div className="w-40 border-l px-1">{e.name} </div>
                            <div className="w-40 border-l px-1">{e.firstName} </div>
                            <div className="w-40 border-l px-1">{e.action} </div>

                        </div>
                    )}
                </div>
            </div>


            <div className="p-5">
                <button
                    onClick={() => getVerifierCreatedEvents().then(data => setEventsVerifierCreated(data))}
                    className="p-2 bg-slate-50 text-blue-600 border "
                >
                    getVerifierCreatedEvents
                </button>

                <div className="flex flex-col">
                    <div className="flex flex-row border border-slate-50  text-slate-50">
                        <div className="bg-rose-600 border-l w-40 px-1">Index</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Verifier</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Name</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Adresse</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Siret</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Approval</div>
                    </div>
                    {eventsVerifierCreated?.map((e: IVerifierCreated, index ) =>
                        <div className="flex flex-row border text-slate-50">
                            <div className="w-40 px-1">{index}</div>
                            <div className="w-40 border-l px-1 ">{e.verifier} </div>
                            <div className="w-40 border-l px-1 ">{e.name} </div>
                            <div className="w-40 border-l px-1 ">{e.addressName} </div>
                            <div className="w-40 border-l px-1 ">{e.siret} </div>
                            <div className="w-40 border-l px-1 ">{e.approvalNumber} </div>
                        </div>
                    )}
                </div>
            </div>


            <div className="p-5">
                <button
                    onClick={() => getVerifierAccountUpdatedEvents().then(data => setEventsVerifierAccountUpdated(data))}
                    className="p-2 bg-slate-50 text-blue-600 border "
                >
                    getVerifierAccountUpdatedEvents
                </button>

                <div className="flex flex-col">
                    <div className="flex flex-row border border-slate-50  text-slate-50">
                        <div className="bg-rose-600 border-l w-40 px-1">Index</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Verifier</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Account</div>
                    </div>
                    {eventsVerifierAccountUpdated?.map((e: string[], index ) =>
                        <div className="flex flex-row border text-slate-50">
                            <div className="w-40 px-1">{index}</div>
                            {e?.map((v) => <div className="w-40 border-l  px-1  ">{v} </div>)}
                        </div>
                    )}
                </div>
            </div>


            <div className="p-5">
                <button
                    onClick={() => getVerifierAddedToCompanyEvents().then(data => setEventsVerifierAddedToCompany(data))}
                    className="p-2 bg-slate-50 text-blue-600 border "
                >
                    getVerifierAddedToCompanyEvents
                </button>

                <div className="flex flex-col">
                    <div className="flex flex-row border border-slate-50  text-slate-50">
                        <div className="bg-rose-600 border-l w-40 px-1">Index</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Company</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Verifier</div>
                    </div>
                    {eventsVerifierAddedToCompany?.map((e: string[], index ) =>
                        <div className="flex flex-row border text-slate-50">
                            <div className="w-40 px-1">{index}</div>
                            {e?.map((v) => <div className="w-40 border-l  px-1  ">{v} </div>)}
                        </div>
                    )}
                </div>
            </div>


            <div className="p-5">
                <button
                    onClick={() => getVerificationTaskCreatedEventsv2().then(data => setEventsVerificationTaskCreated(data))}
                    className="p-2 bg-slate-50 text-blue-600 border "
                >
                    getVerificationTaskCreatedEvents
                </button>

                <div className="flex flex-col">
                    <div className="flex flex-row border border-slate-50  text-slate-50">
                        <div className="bg-rose-600 border-l w-40 px-1">Index</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Company</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Verifier</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Registre ID</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Type</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Task ID</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Status</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Site</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Timestamp</div>
                    </div>
                    {eventsVerificationTaskCreated?.map((e: IVerificationTaskCreated, index ) =>
                        <div className="flex flex-row border text-slate-50">
                            <div className="w-40 px-1">{index}</div>
                            {/*{e?.map((v) => <div className="w-40 border-l  px-1  ">{v} </div>)}*/}
                            <div className="w-40 border-l  px-1  ">{e.company} </div>
                            <div className="w-40 border-l  px-1  ">{e.verifier} </div>
                            <div className="w-40 border-l  px-1  ">{Number(e.registerId)} </div>
                            <div className="w-40 border-l  px-1  ">{e.securityType} </div>
                            <div className="w-40 border-l  px-1  ">{Number(e.taskId)} </div>
                            <div className="w-40 border-l  px-1  ">{Number(e.taskStatus)} </div>
                            <div className="w-40 border-l  px-1  ">{e.siteName} </div>
                            <div className="w-40 border-l  px-1  ">{Number(e.timeStamp)} </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-5">
                <button
                    onClick={() => getVerificationTaskValidatedEventsv2().then(data => setEventsVerificationTaskValidated(data))}
                    className="p-2 bg-slate-50 text-blue-600 border "
                >
                    getVerificationTaskValidatedEvents
                </button>

                <div className="flex flex-col">
                    <div className="flex flex-row border border-slate-50  text-slate-50">
                        <div className="bg-rose-600 border-l w-40 px-1">Index</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Verifier</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Task ID</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Status</div>
                    </div>
                    {eventsVerificationTaskValidated?.map((e: IVerificationTaskValidated, index ) =>
                        <div className="flex flex-row border text-slate-50">
                            <div className="w-40 px-1">{index}</div>
                            {/*{e?.map((v) => <div className="w-40 border-l  px-1  ">{v} </div>)}*/}
                            <div className="w-40 border-l  px-1  ">{e.verifier} </div>
                            <div className="w-40 border-l  px-1  ">{Number(e.taskId)} </div>
                            <div className="w-40 border-l  px-1  ">{Number(e.taskStatus)} </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-5">
                <button
                    onClick={() => getVerificationTaskUpdatedEvents().then(data => setEventsVerificationTaskUpdated(data))}
                    className="p-2 bg-slate-50 text-blue-600 border "
                >
                    getVerificationTaskUpdatedEvents
                </button>

                <div className="flex flex-col">
                    <div className="flex flex-row border border-slate-50  text-slate-50">
                        <div className="bg-rose-600 border-l w-40 px-1">Index</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Company</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Task ID</div>
                        <div className="bg-rose-600 border-l w-40 px-1">Status</div>
                    </div>
                    {eventsVerificationTaskUpdated?.map((e: IVerificationTaskUpdated, index ) =>
                        <div className="flex flex-row border text-slate-50">
                            <div className="w-40 px-1">{index}</div>
                            {/*{e?.map((v) => <div className="w-40 border-l  px-1  ">{v} </div>)}*/}
                            <div className="w-40 border-l px-1">{e.company}</div>
                            <div className="w-40 border-l px-1">{Number(e.taskId)}</div>
                            <div className="w-40 border-l px-1">{Number(e.taskStatus)}</div>
                        </div>
                    )}
                </div>
            </div>

        </div>
  )
}

export default Helper;