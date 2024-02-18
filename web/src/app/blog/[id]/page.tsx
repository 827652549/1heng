export default function BlogIdPage({ params }: { params: { id: string } }) {
    return <div>
        My Blog id: {params.id}
    </div>
}