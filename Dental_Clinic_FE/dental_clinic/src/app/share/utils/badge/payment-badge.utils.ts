export function getPaymentStatusBadge(status: string) {
    switch (status) {
        case 'confirmed': return 'info';
        case 'paid': return 'success';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}