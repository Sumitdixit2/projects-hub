//'use client';

//import { useRouter } from 'next/router';
//import { useState } from 'react';
//import * as z from 'zod';

//const registerSchema = z.object({
//name: z.string().min(2, "Name must be atleast 2 chracters"),
//email: z.string().email(),
//password: z.string().min(6, "password must be at least 6 chracters"),
//phone: z.string().optional(),
//website: z.string().url().optional().or(z.literal((''))),
//description: z.string().optional(),
//});
//
//export default function RegisterPage() {
//const [isloading, setIsLoading] = useState(false);
//const [error, setError] = useState('');
//const router = useRouter();
//
//const form = useForm < z.infer<typeof registerSchema>) => {
//setIsLoading(true);
//setError('');
//try {
//await authService.registerSchema(data);
//} catch (error) {
//
//}
//}
//}

export const def
