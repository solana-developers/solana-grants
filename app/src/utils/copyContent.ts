export default async function copyText(copyValue: string) {
    navigator.clipboard.writeText(copyValue).then()
}