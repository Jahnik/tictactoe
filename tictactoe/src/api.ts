export async function fetchGame() {
    const res = await fetch('/game')
    if (!res.ok) throw new Error('failed to fetch game')
    return res.json()
}

export async function sendMove(move: { row: number, col: number }) {
    const res = await fetch('/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(move),
    })

    if (!res.ok) {
        throw new Error('Failed to make move')
    }

    return res.json()
}
