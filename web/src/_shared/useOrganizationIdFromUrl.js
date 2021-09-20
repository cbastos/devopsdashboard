
export default function useOrganizationIdFromUrl(useParams) {
    const { organizationid: organizationId } = useParams();
    return [organizationId];
}