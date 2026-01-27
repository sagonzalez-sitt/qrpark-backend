import {Injectable} from '@nestjs/common';
import {environmentVariables} from "../../config";
import * as QRCode from 'qrcode';

@Injectable()
export class QrService
{
    async generateQrDataUrl(token: string): Promise<string>
    {
        const url = `${environmentVariables.FRONTEND_URL}/ticket/${token}`;

        try
        {
            return await QRCode.toDataURL(url, {
                width: 500,
                margin: 2,
                errorCorrectionLevel: 'H',
            });
        }
        catch (e)
        {
            throw new Error(`Failed to generate QR code: ${e}`);
        }
    }

    async generateQrBuffer(token: string): Promise<Buffer>
    {
        const url = `${environmentVariables.FRONTEND_URL}/ticket/${token}`;

        try
        {
            return await QRCode.toBuffer(url, {
                width: 500,
                margin: 2,
                errorCorrectionLevel: 'H',
            });
        }
        catch (e)
        {
            throw new Error(`Failed to generate QR code: ${e}`);
        }
    }

    async generateLargeQrDataUrl(token: string): Promise<string>
    {
        const url = `${environmentVariables.FRONTEND_URL}/ticket/${token}`;

        try
        {
            return await QRCode.toDataURL(url, {
                width: 1000,
                margin: 4,
                errorCorrectionLevel: 'H',
            });
        }
        catch (e)
        {
            throw new Error(`Failed to generate QR code: ${e}`);
        }
    }

    isValidToken(token: string): boolean
    {
        return /^[a-f0-9]{32}$/i.test(token);
    }

    async generateQrFromContent(content: string): Promise<string>
    {
        try
        {
            return await QRCode.toDataURL(content, {
                width: 500,
                margin: 2,
                errorCorrectionLevel: 'H',
            });
        }
        catch (e)
        {
            throw new Error(`Failed to generate QR code: ${e}`);
        }
    }
}
