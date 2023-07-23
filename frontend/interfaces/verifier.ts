export interface Verifier {
    name: string
    addressName: string
    siret: string
    approvalNumber: string
}

export interface VerifierAccount {
    verifier: `0x${string}`
    active: boolean
}