const superAdminPermissions = [
    {
        role: "superAdmin",
        description: "Has site wide access to all admin functionalities",
        permissions: [
            "create-admin",
            "view-users",
            "view-admins",
            "sanction-users",
            "sanction-admins",
            "mark-delivery-status",
            "view-orders",
            "rate-products"
        ]

    }
]

const adminPermissions = [
    {
        role: "admin",
        description: "has access to sanction merchants",
        permissions: [
            "view-users",
            "view-orders",
            "sanction-users"
        ]

    }
]


const managerPermissions = [
    {
        role: "manager",
        description: "can rate products delivered by merchants and also mark delivery status",
        permissions: [
            "mark-delivery-status",
            "view-orders",
            "rate-products"
        ]

    }
]



export  {
    superAdminPermissions,
    adminPermissions,
    managerPermissions
}




