export function formatDuration(milliseconds: number): string
{
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) return `${minutes} min`;

    return `${hours}h ${minutes}min`;
}